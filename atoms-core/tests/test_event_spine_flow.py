"""
Tests for Event Spine V2 Flow.
"""
import sys
import unittest
from unittest.mock import MagicMock, patch

# Ensure src can be imported
sys.path.append("atoms-core")

from src.event_spine.models import EventCreate
from src.event_spine.pii import redact_payload, rehydrate_payload
from src.event_spine.service import EventService
from src.event_spine.repository import EventRepository

class TestEventSpineFlow(unittest.TestCase):

    def test_pii_logic(self):
        # 1. Redaction
        payload = {
            "user": "John Doe",
            "contact": "Contact me at john.doe@example.com please.",
            "meta": {"email": "hidden@example.org"}
        }
        redacted, tokens = redact_payload(payload)

        print(f"\nRedacted: {redacted}")
        print(f"Tokens: {tokens}")

        self.assertNotIn("john.doe@example.com", redacted["contact"])
        self.assertNotIn("hidden@example.org", redacted["meta"]["email"])
        self.assertEqual(len(tokens), 2)

        # 2. Rehydration
        token_map = {t["token_key"]: t["raw_value"] for t in tokens}
        rehydrated = rehydrate_payload(redacted, token_map)

        print(f"Rehydrated: {rehydrated}")

        self.assertEqual(rehydrated["contact"], "Contact me at john.doe@example.com please.")
        self.assertEqual(rehydrated["meta"]["email"], "hidden@example.org")

    def test_service_append_flow(self):
        # Mock Repo
        mock_repo = MagicMock(spec=EventRepository)
        mock_repo.create_event.return_value = "evt_123"

        service = EventService(mock_repo)

        event_in = EventCreate(
            tenant_id="t_test",
            mode="saas",
            project_id="p_1",
            run_id="run_1",
            event_type="TEST_EVENT",
            display_name="Test Event",
            raw_name="TEST_EVENT_RAW",
            payload={"email": "secret@test.com"}
        )

        # Call Append
        event_id = service.append_event(event_in)

        self.assertEqual(event_id, "evt_123")

        # Verify Repo calls
        # 1. create_event called with NO payload field
        call_args = mock_repo.create_event.call_args[0][0]
        self.assertNotIn("payload", call_args)
        self.assertEqual(call_args["tenant_id"], "t_test")

        # 2. create_payload called with REDACTED data
        mock_repo.create_payload.assert_called_once()
        # kwargs usage in assert
        _, kwargs = mock_repo.create_payload.call_args
        self.assertEqual(kwargs["event_id"], "evt_123")
        self.assertNotIn("secret@test.com", str(kwargs["data"]))

        # 3. create_pii_tokens called
        mock_repo.create_pii_tokens.assert_called_once()
        tokens_arg = mock_repo.create_pii_tokens.call_args[0][0]
        self.assertEqual(len(tokens_arg), 1)
        self.assertEqual(tokens_arg[0]["raw_value"], "secret@test.com")
        self.assertEqual(tokens_arg[0]["event_id"], "evt_123")

    def test_service_replay_flow(self):
        mock_repo = MagicMock(spec=EventRepository)
        service = EventService(mock_repo)

        # Setup Data
        raw_event = {
            "id": "evt_1",
            "tenant_id": "t_test",
            "run_id": "run_1",
            "event_spine_v2_payloads": [
                {"data": {"email": "{{pii_abcdef12}}"}, "payload_type": "event_payload"}
            ]
        }
        mock_repo.get_events_by_run.return_value = [raw_event]

        mock_repo.get_pii_tokens_for_events.return_value = [
            {"token_key": "pii_abcdef12", "raw_value": "secret@test.com", "event_id": "evt_1"}
        ]

        # 1. No Rehydrate
        events = service.get_run_events("t_test", "run_1", rehydrate=False)
        self.assertEqual(events[0]["event_spine_v2_payloads"][0]["data"]["email"], "{{pii_abcdef12}}")

        # 2. With Rehydrate
        events_h = service.get_run_events("t_test", "run_1", rehydrate=True)
        self.assertEqual(events_h[0]["event_spine_v2_payloads"][0]["data"]["email"], "secret@test.com")

if __name__ == "__main__":
    unittest.main()
