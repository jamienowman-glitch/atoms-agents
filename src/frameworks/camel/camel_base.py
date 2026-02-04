"""CAMEL base framework wrapper."""
from atoms_agents.src.frameworks.base_framework import BaseFramework


class CAMELBaseFramework(BaseFramework):
    FRAMEWORK_ID = "camel"
    NAME = "CAMEL"
    DESCRIPTION = "Base wrapper for CAMEL framework."
    SUPPORTED_BACKENDS = ['openai', 'anthropic', 'google', 'bedrock', 'mistral', 'groq', 'openrouter', 'nvidia', 'huggingface']
