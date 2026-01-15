from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional
from dataclasses import dataclass
from enum import Enum


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
    ) -> Dict[str, Any]:  # Standardized result
        pass

    @abstractmethod
    def check_readiness(self) -> ReadinessResult:
        pass
