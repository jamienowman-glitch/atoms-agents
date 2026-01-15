import pytest
import os
import shutil
from northstar.registry.writer import RegistryWriter

@pytest.fixture
def writer(tmp_path):
    # Mock workspace dir
    w = RegistryWriter()
    w.workspace.root_dir = tmp_path / ".northstar" / "workspace"
    os.makedirs(w.workspace.root_dir, exist_ok=True)
    return w

def test_node_lifecycle(writer):
    # Create
    writer.create_node("node.test", "Test Node", "agent")
    card = writer._load_or_empty("node", "node.test")
    assert card["name"] == "Test Node"
    assert card["kind"] == "agent"
    
    # Update
    writer.update_node_fields("node.test", {"persona_ref": "p1"})
    card = writer._load_or_empty("node", "node.test")
    assert card["persona_ref"] == "p1"
    
    # Delete
    writer.delete_node("node.test")
    assert not os.path.exists(writer._get_path("node", "node.test"))

def test_flow_lifecycle(writer):
    # Create
    writer.create_node("node.a", "A", "agent")
    writer.create_node("node.b", "B", "agent")
    writer.create_flow("flow.test", "Test Flow", "Obj", "node.a")
    
    card = writer._load_or_empty("flow", "flow.test")
    assert card["entry_node"] == "node.a"
    assert "node.a" in card["nodes"]
    
    # Add Edge
    writer.add_flow_edge("flow.test", "node.a", "node.b")
    card = writer._load_or_empty("flow", "flow.test")
    assert "node.b" in card["nodes"] # implicit add
    assert {"from": "node.a", "to": "node.b"} in card["edges"]
    
    # Remove Edge
    writer.remove_flow_edge("flow.test", "node.a", "node.b")
    card = writer._load_or_empty("flow", "flow.test")
    assert len(card["edges"]) == 0
