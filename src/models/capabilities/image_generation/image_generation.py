"""Image Generation capability."""
from atoms_agents.src.models.capabilities.base_capability import BaseCapability


class ImageGenerationCapability(BaseCapability):
    CAPABILITY_ID = "image_generation"
    NAME = "Image Generation"
    DESCRIPTION = "Text-to-image generation."
    SUPPORTED_BACKENDS = ['openai', 'google', 'huggingface']
