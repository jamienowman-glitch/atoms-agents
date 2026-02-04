"""NeMo base framework wrapper."""
from atoms_agents.src.frameworks.base_framework import BaseFramework


class NeMoBaseFramework(BaseFramework):
    FRAMEWORK_ID = "nemo"
    NAME = "NeMo"
    DESCRIPTION = "Base wrapper for NeMo framework."
    SUPPORTED_BACKENDS = ['openai', 'anthropic', 'google', 'bedrock', 'mistral', 'groq', 'openrouter', 'nvidia', 'huggingface']
