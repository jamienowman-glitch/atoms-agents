"""CrewAI base framework wrapper."""
from atoms_agents.src.frameworks.base_framework import BaseFramework


class CrewAIBaseFramework(BaseFramework):
    FRAMEWORK_ID = "crewai"
    NAME = "CrewAI"
    DESCRIPTION = "Base wrapper for CrewAI framework."
    SUPPORTED_BACKENDS = ['openai', 'anthropic', 'google', 'bedrock', 'mistral', 'groq', 'openrouter', 'nvidia', 'huggingface']
