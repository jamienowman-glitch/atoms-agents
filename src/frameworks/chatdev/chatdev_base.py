"""ChatDev base framework wrapper."""
from atoms_agents.src.frameworks.base_framework import BaseFramework


class ChatDevBaseFramework(BaseFramework):
    FRAMEWORK_ID = "chatdev"
    NAME = "ChatDev"
    DESCRIPTION = "Base wrapper for ChatDev framework."
    SUPPORTED_BACKENDS = ['openai', 'anthropic', 'google', 'bedrock', 'mistral', 'groq', 'openrouter', 'nvidia', 'huggingface']
