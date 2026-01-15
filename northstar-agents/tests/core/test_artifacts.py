

from northstar.core.artifacts import LocalArtifactStore

def test_local_artifact_store(tmp_path):
    base_dir = str(tmp_path / "artifacts")
    store = LocalArtifactStore(base_dir)
    
    content = b"some data"
    ref = store.save_artifact(content, "text/plain", name="mylog.txt")
    
    assert ref.type == "text/plain"
    assert ref.uri.startswith("file://")
    assert "mylog.txt" in ref.uri
    
    loaded = store.load_artifact(ref)
    assert loaded == content
    
    artifacts = store.list_artifacts()
    assert len(artifacts) == 1
    assert artifacts[0].id == ref.id
