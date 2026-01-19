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
    elif provider_id == "groq":
        from northstar.runtime.providers.groq import GroqGateway
        return GroqGateway()
    elif provider_id == "jules":
        from northstar.runtime.providers.jules import JulesGateway
        return JulesGateway()
    elif provider_id == "gemini":
        from northstar.runtime.providers.gemini import GeminiGateway
        return GeminiGateway()
    elif provider_id == "openrouter":
        from northstar.runtime.providers.openrouter import OpenRouterGateway
        return OpenRouterGateway()
    elif provider_id == "nvidia":
        from northstar.runtime.providers.nvidia import NvidiaGateway
        return NvidiaGateway()
    elif provider_id == "comet":
        from northstar.runtime.providers.comet import CometGateway
        return CometGateway()
    else:
        raise ValueError(f"Unknown provider: {provider_id}")
