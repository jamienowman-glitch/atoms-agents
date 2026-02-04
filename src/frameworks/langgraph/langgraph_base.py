"""LangGraph base framework wrapper."""
from atoms_agents.src.frameworks.base_framework import BaseFramework


class LangGraphBaseFramework(BaseFramework):
    FRAMEWORK_ID = "langgraph"
    NAME = "LangGraph"
    DESCRIPTION = "Base wrapper for LangGraph framework."
    SUPPORTED_BACKENDS = ['openai', 'anthropic', 'google', 'bedrock', 'mistral', 'groq', 'openrouter', 'nvidia', 'huggingface']
