import pytest
from unittest.mock import MagicMock, patch
from engines.agents_boundary.runner import run_agent_task
from northstar.runtime.node_result import NodeRunResult

# Mock NodeExecutor to avoid real network calls
@pytest.fixture
def mock_node_executor():
    with patch("engines.agents_boundary.runner.NodeExecutor") as mock:
        yield mock

def test_run_agent_task_success(mock_node_executor):
    # Setup mock return
    executor_instance = mock_node_executor.return_value

    mock_result = NodeRunResult(
        node_id="n_test",
        status="PASS",
        reason="Success",
        started_ts=0,
        ended_ts=1,
        events=[
            {"type": "chain_of_thought", "content": "Hello World", "provider": "mock", "model": "mock"},
            {"type": "node_end", "payload": {"status": "PASS"}}
        ]
    )
    executor_instance.execute_node.return_value = mock_result

    # Call function
    router_config = {"provider": "mock_provider", "model": "mock_model"}
    result = run_agent_task("Say Hello", router_config)

    # Verify
    assert result["status"] == "PASS"
    assert result["content"] == "Hello World"
    assert len(result["events"]) == 2

    # Verify calls
    executor_instance.execute_node.assert_called_once()
    args, kwargs = executor_instance.execute_node.call_args
    node = kwargs.get("node")
    assert node.provider_ref == "mock_provider"
    assert node.model_ref == "mock_model"
