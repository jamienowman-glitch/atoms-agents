import sys
import os
import uuid
import unittest
from unittest.mock import MagicMock, patch
from datetime import datetime, timezone

# Add project root to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from atoms_tuning.ingest import Ingestor

class TestIngestion(unittest.TestCase):
    @patch("atoms_tuning.ingest.get_supabase_client")
    @patch("atoms_tuning.ingest.get_settings")
    def test_end_to_end_flow(self, mock_settings, mock_get_client):
        # Mock Client
        mock_client = MagicMock()
        mock_get_client.return_value = mock_client

        # Mock Settings
        mock_settings.return_value = MagicMock()

        # Setup Ingestor
        ingestor = Ingestor()

        # 1. Mock State (First run)
        mock_client.table.return_value.select.return_value.eq.return_value.execute.return_value.data = []

        # 2. Mock Events Fetch
        run_id = str(uuid.uuid4())
        tenant_id = "t_test"
        event_id = str(uuid.uuid4())

        mock_event = {
            "id": event_id,
            "tenant_id": tenant_id,
            "run_id": run_id,
            "event_type": "TUNING_SESSION_START",
            "created_at": "2024-01-01T12:00:00Z"
        }

        query_mock = mock_client.table.return_value.select.return_value \
            .gt.return_value \
            .order.return_value \
            .limit.return_value

        query_mock.in_.return_value.execute.return_value.data = [mock_event]

        # 3. Mock Opt-In Check and Table Operations
        def table_side_effect(name):
            t_mock = MagicMock()
            if name == "tuning_ingest_state":
                t_mock.select.return_value.eq.return_value.execute.return_value.data = []
                t_mock.upsert.return_value.execute.return_value.data = [{"status": "ok"}]
            elif name == "event_spine_v2_events":
                t_mock.select.return_value.gt.return_value.order.return_value.limit.return_value.in_.return_value.execute.return_value.data = [mock_event]
            elif name == "event_spine_v2_payloads":
                 t_mock.select.return_value.eq.return_value.execute.return_value.data = [{"data": {"model_id": "gpt-4"}}]
            elif name == "tuning_opt_ins":
                t_mock.select.return_value.eq.return_value.execute.return_value.data = [{"is_enabled": True}]
            elif name == "tuning_sessions":
                t_mock.select.return_value.eq.return_value.execute.return_value.data = []
                t_mock.insert.return_value.execute.return_value.data = [{"id": "session-uuid"}]
            elif name == "kpi_outcomes":
                t_mock.insert.return_value.execute.return_value.data = [{"id": "kpi-uuid"}]
            elif name == "rl_feedback":
                t_mock.insert.return_value.execute.return_value.data = [{"id": "rl-uuid"}]
            return t_mock

        mock_client.table.side_effect = table_side_effect

        # Run
        count = ingestor.run_batch()

        # Verify
        self.assertEqual(count, 1)
        print("Test passed: 1 event processed.")

if __name__ == "__main__":
    unittest.main()
