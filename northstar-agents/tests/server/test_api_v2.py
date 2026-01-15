import pytest
from unittest.mock import MagicMock, patch
from northstar.server.api import APIHandler

@pytest.fixture
def api_handler():
    with patch("northstar.server.api.load_registry_for_cli") as mock_load:
        mock_ctx = MagicMock()
        mock_ctx.nodes = {}
        mock_ctx.flows = {}
        # Mock new collections
        p_card = MagicMock()
        p_card.name = "Test Persona"
        mock_ctx.personas = {"p1": p_card}
        
        t_card = MagicMock()
        t_card.name = "Test Task"
        mock_ctx.tasks = {"t1": t_card}
        
        mock_ctx.providers = {"bedrock": MagicMock()}
        
        m_card = MagicMock()
        m_card.model_id = "claude-3"
        mock_ctx.models = {"m1": m_card}
        
        mock_load.return_value = mock_ctx
        handler = APIHandler()
        return handler

def test_get_personas(api_handler):
    resp = api_handler.dispatch("GET", "/api/personas")
    assert resp["status"] == "ok"
    assert len(resp["data"]) == 1
    assert resp["data"][0]["id"] == "p1"
    assert resp["data"][0]["name"] == "Test Persona"

def test_get_tasks(api_handler):
    resp = api_handler.dispatch("GET", "/api/tasks")
    assert resp["status"] == "ok"
    assert len(resp["data"]) == 1
    assert resp["data"][0]["id"] == "t1"

def test_get_providers(api_handler):
    resp = api_handler.dispatch("GET", "/api/providers")
    assert resp["status"] == "ok"
    assert resp["data"][0]["id"] == "bedrock"

def test_get_models(api_handler):
    resp = api_handler.dispatch("GET", "/api/models")
    assert resp["status"] == "ok"
    assert resp["data"][0]["name"] == "claude-3"

def test_save_flow(api_handler, tmp_path):
    api_handler.workspace.root_dir = tmp_path
    
    payload = {"id": "f1", "nodes": []}
    resp = api_handler.dispatch("POST", "/api/flow/f1/save", payload)
    
    assert resp["status"] == "ok"
    assert (tmp_path / "flows" / "f1.yaml").exists()
