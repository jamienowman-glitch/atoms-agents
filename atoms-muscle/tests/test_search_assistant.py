import sys
import os
from unittest.mock import MagicMock
import unittest

# Adjust path to find atoms_core and atoms_muscle
sys.path.append(os.getcwd())

# Mock modules BEFORE importing service
sys.modules["atoms_core.src.nexus.service"] = MagicMock()
sys.modules["atoms_core.src.event_spine.service"] = MagicMock()
sys.modules["atoms_core.src.event_spine.repository"] = MagicMock()
sys.modules["atoms_core.src.event_spine.models"] = MagicMock()

# Configure specific mocks
from atoms_core.src.nexus.service import NexusService
from atoms_core.src.event_spine.service import EventService
from atoms_core.src.event_spine.repository import EventRepository
from atoms_core.src.event_spine.models import EventCreate

# We need EventCreate to be a class that can be instantiated
class MockEventCreate:
    def __init__(self, **kwargs):
        self.__dict__.update(kwargs)
EventCreate.side_effect = MockEventCreate

from atoms_muscle.src.knowledge.search_assistant.service import SearchAssistantService

class TestSearchAssistant(unittest.TestCase):
    def setUp(self):
        self.service = SearchAssistantService()
        self.mock_nexus_instance = MagicMock()
        NexusService.return_value = self.mock_nexus_instance

        # Setup mock embeddings
        self.mock_nexus_instance.embed.embed_text.return_value = [0.1, 0.2]

        # Setup mock results
        self.mock_nexus_instance.recall.return_value = [{"_distance": 0.9, "text": "hit1"}]
        self.mock_nexus_instance.many_worlds_recall.return_value = [{"_distance": 0.8, "text": "hit2"}]

    def test_single_domain_search(self):
        kwargs = {
            "tenant_id": "test_tenant",
            "domain": "test_domain",
            "run_id": "test_run"
        }
        res = self.service.run("query string", **kwargs)

        # Verify Nexus called
        NexusService.assert_called_with(tenant_id="test_tenant")
        self.mock_nexus_instance.embed.embed_text.assert_called_with("query string")
        self.mock_nexus_instance.recall.assert_called_with("test_domain", [0.1, 0.2], limit=5)

        # Verify Event Emitted
        self.service.event_service.append_event.assert_called()
        event_arg = self.service.event_service.append_event.call_args[0][0]
        self.assertEqual(event_arg.tenant_id, "test_tenant")
        self.assertEqual(event_arg.event_type, "nexus.search_hit")
        self.assertEqual(event_arg.payload["query"], "query string")
        self.assertEqual(event_arg.payload["mode"], "domain")

    def test_god_mode_search(self):
        kwargs = {
            "tenant_id": "test_tenant",
            "domains": "dom1, dom2",
            "run_id": "test_run"
        }
        res = self.service.run("query string", **kwargs)

        # Verify Nexus called
        self.mock_nexus_instance.many_worlds_recall.assert_called_with(["dom1", "dom2"], [0.1, 0.2], limit=5)

        # Verify Event Emitted
        event_arg = self.service.event_service.append_event.call_args[0][0]
        self.assertEqual(event_arg.payload["mode"], "god")
        self.assertEqual(event_arg.payload["target_domains"], ["dom1", "dom2"])

if __name__ == "__main__":
    unittest.main()
