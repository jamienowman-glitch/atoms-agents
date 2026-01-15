from dataclasses import dataclass, field
from enum import Enum
from typing import Optional, Any, Dict

from northstar.core.logging import StructuredLogger
from northstar.core.artifacts import ArtifactStore
from northstar.core.blackboard import Blackboard
from northstar.core.cancellation import CancellationToken
from northstar.runtime.profiles import PIIStrategy, NexusClient as ProfilesNexusClient
from northstar.core.secrets import SecretProvider
from northstar.runtime.audit.emitter import AuditEmitter, ConsoleAuditEmitter
from northstar.nexus.client import (
    NexusClient,
)  # Removed NoOpNexusClient as default is handled in field
from northstar.nexus.client import NoOpNexusClient


class ContextMode(str, Enum):
    SAAS = "saas"
    ENTERPRISE = "enterprise"
    LAB = "lab"


@dataclass(frozen=True)
class AgentsRequestContext:
    tenant_id: str
    mode: ContextMode
    project_id: str
    request_id: str
    trace_id: Optional[str] = None
    run_id: Optional[str] = None
    step_id: Optional[str] = None
    user_id: Optional[str] = None
    actor_id: Optional[str] = None
    app_id: Optional[str] = None
    surface_id: Optional[str] = None

    def to_headers(self) -> Dict[str, str]:
        headers: Dict[str, str] = {
            "X-Tenant-Id": self.tenant_id,
            "X-Mode": self.mode.value,
        }
        optional_fields = {
            "X-Project-Id": self.project_id,
            "X-Request-Id": self.request_id,
            "X-Trace-Id": self.trace_id,
            "X-Run-Id": self.run_id,
            "X-Step-Id": self.step_id,
            "X-User-Id": self.user_id,
            "X-Actor-Id": self.actor_id,
            "X-App-Id": self.app_id,
            "X-Surface-Id": self.surface_id,
        }
        for header, value in optional_fields.items():
            if value:
                headers[header] = value
        return headers


@dataclass
class RunContext:
    logger: StructuredLogger
    artifact_store: ArtifactStore
    blackboard: Blackboard
    cancellation_token: CancellationToken
    secret_provider: Optional[SecretProvider] = None
    pii_strategy: Optional[PIIStrategy] = None
    # The original nexus_client from profiles is kept, but its type is now ProfilesNexusClient
    # The new nexus_client field uses the NexusClient from northstar.nexus.client
    profiles_nexus_client: Optional[
        ProfilesNexusClient
    ] = None  # Renamed to avoid conflict
    audit_emitter: AuditEmitter = field(default_factory=ConsoleAuditEmitter)
    nexus_client: NexusClient = field(default_factory=NoOpNexusClient)
    # Phase 11: Gateway Wiring
    llm_gateway: Optional[Any] = None  # LLMGateway type (avoid circular import)
    provider_config: Optional[Any] = None  # ProviderConfigCard
    model_card: Optional[Any] = None  # ModelCard
