"""LangChain base framework wrapper."""
from atoms_agents.src.frameworks.base_framework import BaseFramework


class LangChainBaseFramework(BaseFramework):
    FRAMEWORK_ID = "langchain"
    NAME = "LangChain"
    DESCRIPTION = "Base wrapper for LangChain framework."
    SUPPORTED_BACKENDS = ['openai', 'anthropic', 'google', 'bedrock', 'mistral', 'groq', 'openrouter', 'nvidia', 'huggingface']
