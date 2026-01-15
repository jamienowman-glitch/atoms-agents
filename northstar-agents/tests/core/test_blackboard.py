
from northstar.core.blackboard import LocalBlackboard

def test_in_memory_blackboard():
    bb = LocalBlackboard()
    bb.set("foo", "bar")
    assert bb.get("foo") == "bar"
    assert bb.get("missing") is None
    
    bb.delete("foo")
    assert bb.get("foo") is None

def test_persistent_blackboard(tmp_path):
    persist_file = str(tmp_path / "bb.json")
    bb = LocalBlackboard(persist_file)
    bb.set("key", 123)
    
    # Create new instance pointing to same file
    bb2 = LocalBlackboard(persist_file)
    assert bb2.get("key") == 123
