
import pytest
from northstar.core.cancellation import CancellationToken, OperationCancelledError

def test_cancellation_token():
    token = CancellationToken()
    assert not token.is_cancelled()
    
    token.cancel()
    assert token.is_cancelled()
    
    with pytest.raises(OperationCancelledError):
        token.raise_if_cancelled()

def test_not_cancelled():
    token = CancellationToken()
    # Should not raise
    token.raise_if_cancelled()
