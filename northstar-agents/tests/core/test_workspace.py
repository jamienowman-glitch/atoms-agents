import pytest
from northstar.core.workspace import WorkspaceManager

@pytest.fixture
def workspace_dir(tmp_path):
    d = tmp_path / "workspace"
    d.mkdir()
    return d

def test_save_and_load_card(workspace_dir):
    manager = WorkspaceManager(root_dir=workspace_dir)
    content = {"id": "test_node", "type": "node", "foo": "bar"}
    
    path = manager.save_card("nodes", "test_node", content)
    assert path.exists()
    assert path.name == "test_node.yaml"
    
    loaded = manager.load_card("nodes", "test_node")
    assert loaded == content

def test_list_cards(workspace_dir):
    manager = WorkspaceManager(root_dir=workspace_dir)
    manager.save_card("nodes", "n1", {"id": "n1"})
    manager.save_card("nodes", "n2", {"id": "n2"})
    manager.save_card("flows", "f1", {"id": "f1"})
    
    nodes = manager.list_cards("nodes")
    assert "n1" in nodes
    assert "n2" in nodes
    assert "f1" not in nodes
    
    flows = manager.list_cards("flows")
    assert "f1" in flows

def test_clear_workspace(workspace_dir):
    manager = WorkspaceManager(root_dir=workspace_dir)
    manager.save_card("nodes", "n1", {"id": "n1"})
    assert (workspace_dir / "nodes" / "n1.yaml").exists()
    
    manager.clear()
    assert not workspace_dir.exists()

def test_export_workspace(workspace_dir, tmp_path):
    manager = WorkspaceManager(root_dir=workspace_dir)
    manager.save_card("nodes", "n1", {"id": "n1"})
    
    out_dir = tmp_path / "export"
    manager.export(out_dir)
    
    assert out_dir.exists()
    assert (out_dir / "nodes" / "n1.yaml").exists()
    
def test_invalid_type(workspace_dir):
    manager = WorkspaceManager(root_dir=workspace_dir)
    with pytest.raises(ValueError):
        manager.save_card("invalid", "id", {})
