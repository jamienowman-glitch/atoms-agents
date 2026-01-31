"""
Event Spine V2 Repository (Supabase).
"""
from typing import List, Dict, Any, Optional
from supabase import Client, create_client
from src.config import get_settings

class EventRepository:
    def __init__(self, client: Optional[Client] = None):
        if client:
            self.client = client
        else:
            settings = get_settings()
            # If mocking or running without config, client might be None
            # Prefer Service Key for Writes if available
            key = settings.SUPABASE_SERVICE_KEY or settings.SUPABASE_ANON_KEY

            if settings.SUPABASE_URL and key:
                try:
                    self.client = create_client(settings.SUPABASE_URL, key)
                except Exception as e:
                    print(f"Repo Init Error: {e}")
                    self.client = None
            else:
                self.client = None

    def create_event(self, event_data: Dict[str, Any]) -> str:
        if not self.client: return "mock_event_id"
        response = self.client.table("event_spine_v2_events").insert(event_data).execute()
        # Returns list of inserted rows
        if response.data:
            return response.data[0]["id"]
        return "error_no_id"

    def create_payload(self, event_id: str, payload_type: str, data: Dict[str, Any]):
        if not self.client: return
        self.client.table("event_spine_v2_payloads").insert({
            "event_id": event_id,
            "payload_type": payload_type,
            "data": data
        }).execute()

    def create_pii_tokens(self, tokens: List[Dict[str, Any]]):
        if not self.client or not tokens: return
        self.client.table("event_spine_v2_pii_tokens").insert(tokens).execute()

    def get_events_by_run(
        self,
        tenant_id: str,
        run_id: str,
        node_ids: Optional[List[str]] = None,
        canvas_ids: Optional[List[str]] = None,
        agent_ids: Optional[List[str]] = None
    ) -> List[Dict[str, Any]]:
        if not self.client: return []
        # Join with payloads and artifacts
        query = self.client.table("event_spine_v2_events")\
            .select("*, event_spine_v2_payloads(data, payload_type), event_spine_v2_artifacts(uri)")\
            .eq("tenant_id", tenant_id)\
            .eq("run_id", run_id)

        if node_ids:
            query = query.in_("node_id", node_ids)
        if canvas_ids:
            query = query.in_("canvas_id", canvas_ids)
        if agent_ids:
            query = query.in_("agent_id", agent_ids)

        # Order by normalized_timestamp, then sequence_id
        response = query.order("normalized_timestamp", desc=False)\
            .order("sequence_id", desc=False)\
            .execute()
        return response.data

    def get_pii_tokens_for_events(self, event_ids: List[str]) -> List[Dict[str, Any]]:
        if not self.client or not event_ids: return []
        response = self.client.table("event_spine_v2_pii_tokens")\
            .select("*")\
            .in_("event_id", event_ids)\
            .execute()
        return response.data

    def get_recent_events_by_type(
        self,
        tenant_id: str,
        event_type: str,
        limit: int = 100
    ) -> List[Dict[str, Any]]:
        if not self.client: return []
        # Get events and join payload to access data
        query = self.client.table("event_spine_v2_events")\
            .select("*, event_spine_v2_payloads(data, payload_type)")\
            .eq("tenant_id", tenant_id)\
            .eq("event_type", event_type)\
            .order("normalized_timestamp", desc=True)\
            .limit(limit)

        response = query.execute()
        return response.data
