from abc import ABC, abstractmethod
from typing import Mapping, Optional
from northstar.core.artifacts import ArtifactStore, LocalArtifactStore
from northstar.core.blackboard import Blackboard, LocalBlackboard
from northstar.registry.schemas import RunProfileCard

class PIIStrategy(ABC):
    @abstractmethod
    def redact(self, text: str) -> str:
        """Redact sensitive information."""
        pass
        
    @abstractmethod
    def reinsert(self, text: str, mapping: Mapping[str, str]) -> str:
        """Re-insert redacted information."""
        pass

class PassthroughPII(PIIStrategy):
    def redact(self, text: str) -> str:
        return text
        
    def reinsert(self, text: str, mapping: Mapping[str, str]) -> str:
        return text

class NexusClient(ABC):
    @abstractmethod
    def retrieve(self, query: str, context: Optional[str] = None) -> str:
        pass

class DisabledNexus(NexusClient):
    def retrieve(self, query: str, context: Optional[str] = None) -> str:
        return ""

class PersistenceFactory:
    @staticmethod
    def get_artifact_store(profile: RunProfileCard, base_path: str) -> ArtifactStore:
        if profile.persistence_backend == "local":
            return LocalArtifactStore(base_path)
        elif profile.persistence_backend == "infra":
            if profile.allow_local_fallback:
                return LocalArtifactStore(base_path)
            # In real system, we'd return InfraArtifactStore(injected_deps)
            # For now, we hard error if "infra" is requested
            raise RuntimeError("Infra persistence requested but not available. No fallback allowed for this profile.")
        else:
            raise ValueError(f"Unknown persistence backend: {profile.persistence_backend}")

    @staticmethod
    def get_blackboard(profile: RunProfileCard, base_path: str) -> Blackboard:
        # DEPRECATED: Runtime now uses edge-scoped MemoryGateway. 
        # This remains only for legacy local testing or sidecar tools not yet migrated.
        if profile.blackboard_backend == "local":
            return LocalBlackboard(base_path)
        elif profile.blackboard_backend == "infra":
            # STRICT: No fallback allowed for infra blackboard.
            # The Runtime should be using MemoryGateway, so this path implies
            # a misconfiguration or a legacy path that MUST fail in prod.
            raise RuntimeError("Infra blackboard requested. Global blackboard is deprecated in favor of MemoryGateway. No fallback allowed.")
        else:
            raise ValueError(f"Unknown blackboard backend: {profile.blackboard_backend}")

    @staticmethod
    def get_pii_strategy(profile: RunProfileCard) -> PIIStrategy:
        if profile.pii_strategy == "passthrough":
            return PassthroughPII()
        elif profile.pii_strategy == "infra":
            raise RuntimeError("Infra PII requested but not available.")
        # Default allow fallback if needed? Profile says passthrough explicitly for dev.
        # Check fallback
        if profile.allow_local_fallback:
             return PassthroughPII()
        raise ValueError(f"Unknown PII strategy: {profile.pii_strategy}")

    @staticmethod
    def get_nexus_client(profile: RunProfileCard) -> NexusClient:
        if profile.nexus_strategy == "disabled":
            return DisabledNexus()
        elif profile.nexus_strategy == "infra":
             raise RuntimeError("Infra Nexus requested but not available.")
             
        if profile.allow_local_fallback:
            return DisabledNexus()
        raise ValueError(f"Unknown Nexus strategy: {profile.nexus_strategy}")
