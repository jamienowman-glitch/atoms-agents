import time
from datetime import datetime, timezone
from typing import List, Optional, Dict, Any
from uuid import UUID
import logging

from atoms_tuning.config import get_settings
from atoms_tuning.db import get_supabase_client
from atoms_tuning.models import TuningSession, KPIOutcome, RLFeedback

# Configure Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("ingest")

BATCH_SIZE = 100
CONSUMER_ID = "default_worker"

class Ingestor:
    def __init__(self):
        self.supabase = get_supabase_client()
        self.settings = get_settings()
        self._opt_in_cache: Dict[str, bool] = {}

    def get_state(self) -> dict:
        """Fetch the last ingestion state."""
        response = self.supabase.table("tuning_ingest_state")\
            .select("*")\
            .eq("consumer_id", CONSUMER_ID)\
            .execute()

        if response.data:
            return response.data[0]
        return None

    def update_state(self, last_event: dict):
        """Update the cursor."""
        data = {
            "consumer_id": CONSUMER_ID,
            "last_event_id": last_event["id"],
            "last_event_created_at": last_event["created_at"],
            "updated_at": datetime.now(timezone.utc).isoformat()
        }
        self.supabase.table("tuning_ingest_state").upsert(data).execute()

    def is_tenant_opted_in(self, tenant_id: str) -> bool:
        """
        Check if tenant is opted in.
        """
        if tenant_id in self._opt_in_cache:
            return self._opt_in_cache[tenant_id]

        # 1. Check Tenant
        res = self.supabase.table("tuning_opt_ins").select("is_enabled").eq("tenant_id", tenant_id).execute()
        if res.data:
            val = res.data[0]["is_enabled"]
            self._opt_in_cache[tenant_id] = val
            return val

        # 2. Check Global
        res_global = self.supabase.table("tuning_opt_ins").select("is_enabled").eq("tenant_id", "system").execute()
        if res_global.data:
            val = res_global.data[0]["is_enabled"]
            return val

        # 3. Default
        return False

    def get_session_id(self, run_id: str, tenant_id: str, event_meta: dict) -> UUID:
        """
        Finds existing session for run_id or creates one.
        """
        # Try fetch
        res = self.supabase.table("tuning_sessions").select("id").eq("run_id", run_id).execute()
        if res.data:
            return res.data[0]["id"]

        # Create new
        payload = event_meta.get("payload", {})

        session = {
            "run_id": run_id,
            "tenant_id": tenant_id,
            "agent_id": event_meta.get("agent_id"),
            "model_id": payload.get("model_id"),
            "reasoning_profile_id": payload.get("reasoning_profile_id"),
            "provider_id": payload.get("provider_id"),
            "framework_id": payload.get("framework_id"),
            "framework_mode_id": payload.get("framework_mode_id"),
            "started_at": event_meta.get("created_at")
        }

        # Insert
        res_ins = self.supabase.table("tuning_sessions").insert(session).execute()
        if res_ins.data:
            return res_ins.data[0]["id"]

        raise Exception(f"Failed to create session for run {run_id}")

    def fetch_events(self, last_created_at: str):
        """
        Fetch events > last_created_at.
        """
        query = self.supabase.table("event_spine_v2_events")\
            .select("*")\
            .gt("created_at", last_created_at)\
            .order("created_at", desc=False)\
            .limit(BATCH_SIZE)

        types = ["TUNING_SESSION_START", "TUNING_FEEDBACK", "KPI_OUTCOME"]
        query = query.in_("event_type", types)

        return query.execute()

    def fetch_payload(self, event_id: str) -> dict:
        res = self.supabase.table("event_spine_v2_payloads")\
            .select("data")\
            .eq("event_id", event_id)\
            .execute()
        if res.data:
            return res.data[0]["data"]
        return {}

    def run_batch(self):
        state = self.get_state()
        last_created_at = state["last_event_created_at"] if state else "1970-01-01T00:00:00Z"

        logger.info(f"Starting batch from {last_created_at}")

        response = self.fetch_events(last_created_at)
        events = response.data

        if not events:
            logger.info("No new events.")
            return 0

        logger.info(f"Processing {len(events)} events...")

        for event in events:
            tenant_id = event["tenant_id"]
            if not self.is_tenant_opted_in(tenant_id):
                logger.debug(f"Skipping event {event['id']} - Tenant {tenant_id} not opted in.")
                continue

            event_type = event["event_type"]
            run_id = event["run_id"]

            payload = self.fetch_payload(event["id"])
            event["payload"] = payload

            try:
                session_id = self.get_session_id(run_id, tenant_id, event)

                if event_type == "KPI_OUTCOME":
                    outcome = {
                        "session_id": str(session_id),
                        "run_id": run_id,
                        "outcome_data": payload,
                        "score": payload.get("score"),
                        "created_at": event["created_at"]
                    }
                    self.supabase.table("kpi_outcomes").insert(outcome).execute()

                elif event_type == "TUNING_FEEDBACK":
                    feedback = {
                        "session_id": str(session_id),
                        "run_id": run_id,
                        "feedback_type": payload.get("feedback_type", "RL"),
                        "feedback_data": payload,
                        "created_at": event["created_at"]
                    }
                    self.supabase.table("rl_feedback").insert(feedback).execute()

            except Exception as e:
                logger.error(f"Error processing event {event['id']}: {e}")
                pass

            self.update_state(event)

        return len(events)

    def run_loop(self):
        while True:
            count = self.run_batch()
            if count < BATCH_SIZE:
                time.sleep(5)
