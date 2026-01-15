import pytest
import asyncio
from src.core.blackboard import Blackboard
from runtime.autogen.modes import stub_control

def test_control_stub_fails_loudly():
    """
    Verifies that the control stub raises NotImplementedError.
    This proves that the harness/test runner correctly catches unimplemented modes.
    """
    async def run_async():
        blackboard = Blackboard()
        async def mock_emit(t, m): pass
        
        print(f"Testing Control Stub Failure")
        with pytest.raises(NotImplementedError) as excinfo:
            await stub_control.run({}, {}, {}, blackboard, mock_emit)
        
        assert "control stub designed to fail" in str(excinfo.value)
    
    asyncio.run(run_async())
