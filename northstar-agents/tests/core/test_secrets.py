import os
import pytest
from unittest import mock
from northstar.core.secrets import EnvSecretProvider, BlockListSecretProvider, CompositeSecretProvider

def test_env_secret_provider():
    with mock.patch.dict(os.environ, {"TEST_KEY": "secret_value"}):
        provider = EnvSecretProvider()
        assert provider.get_secret("TEST_KEY") == "secret_value"
        assert provider.get_secret("MISSING_KEY") is None

def test_blocklist_provider():
    base_provider = mock.Mock()
    base_provider.get_secret.side_effect = lambda k: "leaked_secret" if k == "BAD_KEY" else "safe_secret"
    
    provider = BlockListSecretProvider(base_provider, ["leaked_secret"])
    
    # Safe key
    assert provider.get_secret("GOOD_KEY") == "safe_secret"
    
    # Bad key should raise RuntimeError
    with pytest.raises(RuntimeError, match="FATAL: Secret 'BAD_KEY' matches a known blocked/leaked value"):
        provider.get_secret("BAD_KEY")

def test_composite_provider():
    p1 = mock.Mock()
    p1.get_secret.return_value = None
    
    p2 = mock.Mock()
    p2.get_secret.return_value = "found_in_p2"
    
    provider = CompositeSecretProvider([p1, p2])
    assert provider.get_secret("KEY") == "found_in_p2"
    p1.get_secret.assert_called_with("KEY")
    p2.get_secret.assert_called_with("KEY")
