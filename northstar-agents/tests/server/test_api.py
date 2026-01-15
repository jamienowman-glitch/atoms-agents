import pytest
import os
from unittest.mock import MagicMock, patch
from northstar.server.api import APIHandler

@pytest.fixture
def api_handler():
    with patch("northstar.server.api.load_registry_for_cli") as mock_load:
        mock_ctx = MagicMock()
        mock_ctx.nodes = {"reg_node": MagicMock(name="Registry Node")}
        mock_ctx.flows = {}
        mock_load.return_value = mock_ctx
        handler = APIHandler()
        return handler

def test_get_nodes(api_handler):
    resp = api_handler.dispatch("GET", "/api/nodes")
    assert resp["status"] == "ok"
    assert len(resp["data"]) >= 1
    assert resp["data"][0]["id"] == "reg_node"

def test_save_node(api_handler, tmp_path):
    # Mock workspace root
    api_handler.workspace.root_dir = tmp_path
    
    payload = {"id": "my_node", "type": "node", "content": "foo"}
    resp = api_handler.dispatch("POST", "/api/node/my_node/save", payload)
    
    assert resp["status"] == "ok"
    assert (tmp_path / "nodes" / "my_node.yaml").exists()

def test_run_node_blocked_without_gate(api_handler):
    # Ensure env var is NOT set
    with patch.dict(os.environ, {}, clear=True):
        payload = {"node_id": "foo", "live": True}
        resp = api_handler.dispatch("POST", "/api/run-node", payload)
        
        assert resp["status"] == "error"
        assert "Live execution blocked" in resp["message"]

def test_run_node_allowed_with_gate(api_handler):
    # Mock executor import since it's hard to integration test in unit layer
    with patch.dict(os.environ, {"NORTHSTAR_LIVE_GATE": "ENABLED"}):
        payload = {"node_id": "foo", "live": True}
        
        # We need to mock the executor import inside the method if possible, 
        # or relying on the stub we wrote which just returns success for MVP.
        resp = api_handler.dispatch("POST", "/api/run-node", payload)
        
        assert resp["status"] == "ok"
