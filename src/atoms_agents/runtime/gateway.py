from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional, TypedDict
from dataclasses import dataclass
from enum import Enum


class TokenUsage(TypedDict):
    input_tokens: int
    output_tokens: int
    total_tokens: int


class GenerationResult(TypedDict):
    role: str
    content: str
    usage: TokenUsage
    finish_reason: Optional[str]
    model_id: str
    cost_usd: float


class ReadinessStatus(Enum):
    READY = "READY"
    MISSING_DEPS = "MISSING_DEPS"
    MISSING_CREDS_OR_CONFIG = "MISSING_CREDS_OR_CONFIG"


@dataclass
class ReadinessResult:
    status: ReadinessStatus
    reason: str
    ready: bool  # Backward compatibility helper

    @property
    def is_ready(self) -> bool:
        return self.status == ReadinessStatus.READY


@dataclass
class CapabilityToggleRequest:
    capability_id: str
    enabled: bool = True
    params: Optional[Dict[str, Any]] = None


class LLMGateway(ABC):
    @abstractmethod
    def generate(
        self,
        messages: List[Dict[str, str]],
        model_card: Any,  # ModelCard
        provider_config: Any,  # ProviderConfigCard
        stream: bool = False,
        capability_toggles: Optional[List[CapabilityToggleRequest]] = None,
        limits: Optional[Any] = None,  # RunLimits
        request_context: Optional[Any] = None,  # AgentsRequestContext (Optional for backward compatibility in signature, but implementations might use it)
    ) -> GenerationResult:  # Standardized result
        pass

    def list_models(self) -> List[str]:
        """Return a list of available model IDs. Default is empty (static config only)."""
        return []

    @abstractmethod
    def check_readiness(self) -> ReadinessResult:
        pass
