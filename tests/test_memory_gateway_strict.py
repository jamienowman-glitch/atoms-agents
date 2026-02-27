import pytest
from unittest.mock import MagicMock
from atoms_agents.runtime.memory_gateway import HttpMemoryGateway
from atoms_agents.runtime.context import AgentsRequestContext, ContextMode
from atoms_agents.engines_boundary.client import EnginesBoundaryClient

@pytest.fixture
def mock_client():
    return MagicMock(spec=EnginesBoundaryClient)

@pytest.fixture
def base_ctx():
    return AgentsRequestContext(
        tenant_id="t1",
        mode=ContextMode.SAAS,
        project_id="p1",
        request_id="req1",
        run_id="r1",
        user_id="u1",
        actor_id="a1"
    )

def test_read_whiteboard_requires_tenant(mock_client):
    # tenant_id="" will trigger the not val check in _require_id
    ctx = AgentsRequestContext(tenant_id="", mode=ContextMode.SAAS, project_id="p1", request_id="r1")
    gateway = HttpMemoryGateway(mock_client, ctx)
    
    with pytest.raises(ValueError, match="tenant_id"):
        gateway.read_whiteboard("run", "r1", "key")

def test_write_whiteboard_requires_all_ids(mock_client):
    # project_id=""
    ctx_no_project = AgentsRequestContext(tenant_id="t1", mode=ContextMode.SAAS, project_id="", request_id="r1", run_id="run1")
    gateway = HttpMemoryGateway(mock_client, ctx_no_project)
    
    with pytest.raises(ValueError, match="project_id"):
        gateway.write_whiteboard("run", "r1", "key", "val")

def test_write_blackboard_requires_run_id(mock_client):
    # run_id=""
    ctx_no_run = AgentsRequestContext(tenant_id="t1", mode=ContextMode.SAAS, project_id="p1", request_id="r1", run_id="")
    gateway = HttpMemoryGateway(mock_client, ctx_no_run)
    
    with pytest.raises(ValueError, match="run_id"):
        gateway.write_blackboard("edge1", "key", "val")

def test_get_inbound_blackboards_calls_batch_endpoint(mock_client, base_ctx):
    gateway = HttpMemoryGateway(mock_client, base_ctx)
    mock_client.request_json.return_value = {"e1": {"k": "v"}}
    
    res = gateway.get_inbound_blackboards(["e1"])
    
    assert res == {"e1": {"k": "v"}}
    _, args, kwargs = mock_client.request_json.mock_calls[0]
    assert args[1] == "/v1/memory/blackboard/batch"
    assert kwargs["json"]["edge_ids"] == ["e1"]
    assert kwargs["params"]["request_tenant_id"] == "t1"

def test_successful_request_with_full_context(mock_client, base_ctx):
    gateway = HttpMemoryGateway(mock_client, base_ctx)
    mock_client.request_json.return_value = {"status": "ok"}
    
    gateway.write_whiteboard("run", "r1", "k", "v")
    
    # Verify that IDs from context are used in payload/params
    _, args, kwargs = mock_client.request_json.mock_calls[0]
    payload = kwargs.get("json", {})
    params = kwargs.get("params", {})
    
    assert payload["project_id"] == "p1"
    assert payload["run_id"] == "r1"
    assert params["request_tenant_id"] == "t1"

def test_get_inbound_blackboards_empty_list(mock_client, base_ctx):
    gateway = HttpMemoryGateway(mock_client, base_ctx)
    res = gateway.get_inbound_blackboards([])
    assert res == {}
    assert mock_client.request_json.call_count == 0
