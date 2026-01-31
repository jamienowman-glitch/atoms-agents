"""
Event Spine V2 Service.
"""
from typing import List, Optional, Dict, Any
from .models import EventCreate
from .repository import EventRepository
from .pii import redact_payload, rehydrate_payload

class EventService:
    def __init__(self, repo: EventRepository):
        self.repo = repo

    def append_event(self, event: EventCreate) -> str:
        # 1. Redact Payload
        redacted_payload = {}
        pii_tokens = []

        if event.payload:
            redacted_payload, tokens = redact_payload(event.payload)
            pii_tokens = tokens

        # 2. Insert Event
        # Convert pydantic to dict, remove payload/artifacts as they go to separate tables
        event_data = event.model_dump(exclude={"payload", "artifacts"}, mode='json')

        event_id = self.repo.create_event(event_data)

        # 3. Insert Payload
        if redacted_payload:
            self.repo.create_payload(
                event_id=event_id,
                payload_type="event_payload",
                data=redacted_payload
            )

        # 4. Insert PII Tokens
        if pii_tokens:
            final_tokens = []
            for t in pii_tokens:
                final_tokens.append({
                    "event_id": event_id,
                    "token_key": t["token_key"],
                    "raw_value": t["raw_value"],
                    "category": t["category"]
                })
            self.repo.create_pii_tokens(final_tokens)

        return event_id

    def get_run_events(
        self,
        tenant_id: str,
        run_id: str,
        rehydrate: bool = False,
        node_ids: Optional[List[str]] = None,
        canvas_ids: Optional[List[str]] = None,
        agent_ids: Optional[List[str]] = None
    ) -> List[dict]:
        # 1. Fetch Events + Payloads
        raw_events = self.repo.get_events_by_run(
            tenant_id,
            run_id,
            node_ids=node_ids,
            canvas_ids=canvas_ids,
            agent_ids=agent_ids
        )

        # Helper to inject artifacts into payload
        def inject_artifacts(event_dict):
            artifacts = event_dict.get("event_spine_v2_artifacts", [])
            artifact_uris = [a["uri"] for a in artifacts] if artifacts else []

            # Add to event root
            event_dict["artifact_uris"] = artifact_uris

            # Add to payloads
            payloads = event_dict.get("event_spine_v2_payloads", [])
            if payloads:
                 for p in payloads:
                      if isinstance(p.get("data"), dict):
                           p["data"]["artifact_uris"] = artifact_uris
            return event_dict

        if not rehydrate:
            return [inject_artifacts(e) for e in raw_events] if raw_events else []

        if not raw_events:
            return []

        # 2. Fetch PII Tokens (if authorized)
        event_ids = [e["id"] for e in raw_events]
        tokens = self.repo.get_pii_tokens_for_events(event_ids)

        # Map tokens: {token_key: raw_value}
        token_map = {t["token_key"]: t["raw_value"] for t in tokens}

        # 3. Rehydrate
        hydrated_events = []
        for e in raw_events:
            # Inject artifacts first (or after, doesn't matter much, but before rehydration logic is safer for copies)
            e = inject_artifacts(e)

            # Make a copy to avoid mutating cache if any
            e_copy = e.copy()

            if token_map:
                payloads = e_copy.get("event_spine_v2_payloads", [])
                if payloads:
                    new_payloads = []
                    for p in payloads:
                        p_copy = p.copy()
                        p_copy["data"] = rehydrate_payload(p_copy["data"], token_map)
                        # Re-inject artifact_uris just in case rehydrate_payload nukes it (it shouldn't, but let's be safe)
                        # Actually rehydrate_payload probably just string replaces or traverses dict.
                        # Since we added artifact_uris to p['data'] in inject_artifacts, it is already there.
                        new_payloads.append(p_copy)
                    e_copy["event_spine_v2_payloads"] = new_payloads

            hydrated_events.append(e_copy)

        return hydrated_events
