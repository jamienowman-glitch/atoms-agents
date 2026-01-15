import os
from abc import ABC, abstractmethod
from typing import Optional, List

class SecretProvider(ABC):
    @abstractmethod
    def get_secret(self, key: str) -> Optional[str]:
        """Retrieve a secret by key. Returns None if not found."""
        pass

class EnvSecretProvider(SecretProvider):
    def get_secret(self, key: str) -> Optional[str]:
        # Strictly get from process environment
        return os.environ.get(key)

class BlockListSecretProvider(SecretProvider):
    """
    Wraps another provider and checks against a blocklist of known leaked values.
    Use this for checking against committed example keys if necessary.
    """
    def __init__(self, provider: SecretProvider, blocked_values: List[str]):
        self.provider = provider
        self.blocked_values = set(blocked_values)

    def get_secret(self, key: str) -> Optional[str]:
        val = self.provider.get_secret(key)
        if val and val in self.blocked_values:
            raise RuntimeError(f"FATAL: Secret '{key}' matches a known blocked/leaked value!")
        return val

class CompositeSecretProvider(SecretProvider):
    """Chains multiple providers."""
    def __init__(self, providers: List[SecretProvider]):
        self.providers = providers

    def get_secret(self, key: str) -> Optional[str]:
        for p in self.providers:
            val = p.get_secret(key)
            if val is not None:
                return val
        return None
