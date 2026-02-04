"""Strands base framework wrapper."""
from atoms_agents.src.frameworks.base_framework import BaseFramework


class StrandsBaseFramework(BaseFramework):
    FRAMEWORK_ID = "strands"
    NAME = "Strands"
    DESCRIPTION = "Base wrapper for Strands framework."
    SUPPORTED_BACKENDS = ['openai', 'anthropic', 'google', 'bedrock', 'mistral', 'groq', 'openrouter', 'nvidia', 'huggingface']
