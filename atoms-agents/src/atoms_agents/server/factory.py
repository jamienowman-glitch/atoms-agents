from typing import Dict, Type
from atoms_agents.runtime.gateway import LLMGateway
from atoms_agents.runtime.providers.jules import JulesGateway

class GatewayFactory:
    _REGISTRY: Dict[str, Type[LLMGateway]] = {
        "provider.jules": JulesGateway,
    }

    @classmethod
    def get_gateway(cls, provider_id: str) -> LLMGateway:
        gateway_cls = cls._REGISTRY.get(provider_id)
        if not gateway_cls:
            raise ValueError(f"No gateway implementation for provider: {provider_id}")
        return gateway_cls()
