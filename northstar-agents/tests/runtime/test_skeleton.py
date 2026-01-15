import pytest
from northstar.runtime.context import RunContext
from northstar.runtime.exceptions import SkipMode
from northstar.core.logging import StructuredLogger
from northstar.core.artifacts import LocalArtifactStore
from northstar.core.blackboard import LocalBlackboard
from northstar.core.cancellation import CancellationToken

def test_context_initialization(tmp_path):
    log_dir = tmp_path / "logs"
    store_dir = tmp_path / "store"
    bb_dir = tmp_path / "bb"
    
    ctx = RunContext(
        logger=StructuredLogger(str(log_dir)),
        artifact_store=LocalArtifactStore(str(store_dir)),
        blackboard=LocalBlackboard(str(bb_dir)),
        cancellation_token=CancellationToken()
    )
    
    assert ctx.logger is not None
    assert ctx.artifact_store is not None
    assert ctx.blackboard is not None
    assert ctx.cancellation_token is not None

def test_skip_mode_exception():
    exc = SkipMode("Reason")
    assert str(exc) == "Reason"
    assert exc.reason == "Reason"
    
    with pytest.raises(SkipMode) as info:
        raise SkipMode("Test skip")
    assert info.value.reason == "Test skip"
