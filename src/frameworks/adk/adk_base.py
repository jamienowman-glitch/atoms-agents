"""ADK base framework wrapper."""
from atoms_agents.src.frameworks.base_framework import BaseFramework


class ADKBaseFramework(BaseFramework):
    FRAMEWORK_ID = "adk"
    NAME = "ADK"
    DESCRIPTION = "Base wrapper for ADK framework."
    SUPPORTED_BACKENDS = ['openai', 'anthropic', 'google', 'bedrock', 'mistral', 'groq', 'openrouter', 'nvidia', 'huggingface']
