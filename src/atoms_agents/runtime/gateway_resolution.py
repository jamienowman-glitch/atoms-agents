from typing import Any
from atoms_agents.runtime.gateway import LLMGateway

def resolve_gateway(provider_id: str) -> LLMGateway:
    if provider_id == "bedrock":
        from atoms_agents.runtime.providers.bedrock import BedrockGateway
        return BedrockGateway()
    elif provider_id == "vertex":
        from atoms_agents.runtime.providers.vertex import VertexGateway
        return VertexGateway()
    elif provider_id == "azure_openai":
        from atoms_agents.runtime.providers.azure_openai import AzureOpenAIGateway
        return AzureOpenAIGateway()
    elif provider_id == "groq":
        from atoms_agents.runtime.providers.groq import GroqGateway
        return GroqGateway()
    elif provider_id == "jules":
        from atoms_agents.runtime.providers.jules import JulesGateway
        return JulesGateway()
    elif provider_id == "gemini":
        from atoms_agents.runtime.providers.gemini import GeminiGateway
        return GeminiGateway()
    elif provider_id == "openrouter":
        from atoms_agents.runtime.providers.openrouter import OpenRouterGateway
        return OpenRouterGateway()
    elif provider_id == "nvidia":
        from atoms_agents.runtime.providers.nvidia import NvidiaGateway
        return NvidiaGateway()
    elif provider_id == "comet":
        from atoms_agents.runtime.providers.comet import CometGateway
        return CometGateway()
    else:
        raise ValueError(f"Unknown provider: {provider_id}")
