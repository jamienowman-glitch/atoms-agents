"""Image Editing capability."""
from atoms_agents.src.models.capabilities.base_capability import BaseCapability


class ImageEditingCapability(BaseCapability):
    CAPABILITY_ID = "image_editing"
    NAME = "Image Editing"
    DESCRIPTION = "Inpainting and upscaling."
    SUPPORTED_BACKENDS = ['openai', 'google']
