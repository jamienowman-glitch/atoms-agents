"""Swarm base framework wrapper."""
from atoms_agents.src.frameworks.base_framework import BaseFramework


class SwarmBaseFramework(BaseFramework):
    FRAMEWORK_ID = "swarm"
    NAME = "Swarm"
    DESCRIPTION = "Base wrapper for Swarm framework."
    SUPPORTED_BACKENDS = ['openai', 'anthropic', 'google', 'bedrock', 'mistral', 'groq', 'openrouter', 'nvidia', 'huggingface']
