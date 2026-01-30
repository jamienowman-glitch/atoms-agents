"""
Tests for Event Spine V2 Updates (Worker C).
"""
import sys
import unittest
from unittest.mock import MagicMock

# Ensure src can be imported
sys.path.append("atoms-core")

from src.event_spine.service import EventService
from src.event_spine.repository import EventRepository

class TestEventSpineUpdates(unittest.TestCase):

    def test_get_run_events_filters_and_artifacts(self):
        mock_repo = MagicMock(spec=EventRepository)
        service = EventService(mock_repo)

        # Setup Data with Artifacts
        raw_event = {
            "id": "evt_1",
            "tenant_id": "t_test",
            "run_id": "run_1",
            "event_spine_v2_artifacts": [
                {"uri": "s3://test/cat.png"}
            ],
            "event_spine_v2_payloads": [
                {"data": {"status": "done"}, "payload_type": "event_payload"}
            ]
        }
        mock_repo.get_events_by_run.return_value = [raw_event]

        # Call with filters
        events = service.get_run_events(
            "t_test",
            "run_1",
            rehydrate=False,
            node_ids=["n1"],
            canvas_ids=["c1"],
            agent_ids=["a1"]
        )

        # Verify Repo Call Args
        mock_repo.get_events_by_run.assert_called_once_with(
            "t_test", "run_1",
            node_ids=["n1"],
            canvas_ids=["c1"],
            agent_ids=["a1"]
        )

        # Verify Artifact Injection
        self.assertEqual(events[0]["artifact_uris"], ["s3://test/cat.png"])
        self.assertEqual(events[0]["event_spine_v2_payloads"][0]["data"]["artifact_uris"], ["s3://test/cat.png"])

if __name__ == "__main__":
    unittest.main()
