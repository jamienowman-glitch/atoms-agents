from typing import Any
from northstar.runtime.gateway import LLMGateway

def resolve_gateway(provider_id: str) -> LLMGateway:
    if provider_id == "bedrock":
        from northstar.runtime.providers.bedrock import BedrockGateway
        return BedrockGateway()
    elif provider_id == "vertex":
        from northstar.runtime.providers.vertex import VertexGateway
        return VertexGateway()
    elif provider_id == "azure_openai":
        from northstar.runtime.providers.azure_openai import AzureOpenAIGateway
        return AzureOpenAIGateway()
    else:
        raise ValueError(f"Unknown provider: {provider_id}")
