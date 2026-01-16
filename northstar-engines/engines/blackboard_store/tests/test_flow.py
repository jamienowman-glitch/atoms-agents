import pytest
import asyncio
from unittest.mock import MagicMock, patch
from engines.blackboard_store.service import BlackboardStoreService
from engines.blackboard_store.models import BlackboardState
from engines.common.identity import RequestContext

class MemoryBlackboardStore:
    def __init__(self):
        self.store = {}

    def write(self, key, value, context, run_id, expected_version=None):
        doc_id = f"{run_id}#{key}"
        current = self.store.get(doc_id)
        current_version = current['version'] if current else 0

        if expected_version is not None and expected_version != current_version:
             raise Exception("Version conflict")

        new_version = current_version + 1
        # emulate cloud store behavior of dumping Pydantic
        if hasattr(value, 'model_dump'):
            value = value.model_dump()

        data = {
            "key": key,
            "value": value,
            "version": new_version,
            "created_by": "test",
            "created_at": "now",
            "updated_by": "test",
            "updated_at": "now"
        }
        self.store[doc_id] = data
        return data

    def read(self, key, context, run_id, version=None):
        doc_id = f"{run_id}#{key}"
        return self.store.get(doc_id)

    def list_keys(self, context, run_id):
        return []

@pytest.mark.asyncio
async def test_blackboard_flow():
    # Mock context
    context = RequestContext(tenant_id="t_1", env="dev", project_id="p1", user_id="u1", mode="saas")

    # Mock dependencies
    with patch("engines.blackboard_store.service.routing_registry") as mock_registry, \
         patch("engines.blackboard_store.service.FirestoreBlackboardStore"), \
         patch("engines.blackboard_store.distiller.stream_chat") as mock_chat:

        # Configure registry mock
        mock_route = MagicMock()
        mock_route.backend_type = "firestore"
        mock_route.config = {"project": "test"}
        mock_registry.return_value.get_route.return_value = mock_route

        # Mock LLM response
        mock_chat.return_value = ["Distilled Context:\nSummary of changes.\nTakeaways:\n- Key point 1\n- Key point 2\n- Key point 3"]

        service = BlackboardStoreService(context)
        # Swap adapter with memory store
        service._adapter = MemoryBlackboardStore()

        # Test commit_turn
        run_id = "run_1"
        key = "board_1"
        data = {"foo": "bar"}

        result = await service.commit_turn(key, data, run_id, auto_distill=True)

        assert result["version"] == 1
        val = result["value"]
        assert val["raw_data"] == data
        assert val["distilled_context"] == "Summary of changes."
        assert len(val["takeaways"]) == 3
        assert val["takeaways"][0] == "Key point 1"

        # Read back
        read_result = service.read(key, run_id)
        assert read_result["version"] == 1
        assert read_result["value"]["distilled_context"] == "Summary of changes."

        # Test update (commit_turn again)
        new_data = {"foo": "baz"}
        mock_chat.return_value = ["Distilled Context:\nNew summary.\nTakeaways:\n- New point 1"]

        result2 = await service.commit_turn(key, new_data, run_id, auto_distill=True)
        assert result2["version"] == 2
        val2 = result2["value"]
        assert val2["raw_data"] == new_data
        assert val2["distilled_context"] == "New summary."
        assert val2["takeaways"] == ["New point 1"]
