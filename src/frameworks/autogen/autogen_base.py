"""AutoGen base framework wrapper."""
from atoms_agents.src.frameworks.base_framework import BaseFramework


class AutoGenBaseFramework(BaseFramework):
    FRAMEWORK_ID = "autogen"
    NAME = "AutoGen"
    DESCRIPTION = "Base wrapper for AutoGen framework."
    SUPPORTED_BACKENDS = ['openai', 'anthropic', 'google', 'bedrock', 'mistral', 'groq', 'openrouter', 'nvidia', 'huggingface']
