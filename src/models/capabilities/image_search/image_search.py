"""Image Search capability."""
from atoms_agents.src.models.capabilities.base_capability import BaseCapability


class ImageSearchCapability(BaseCapability):
    CAPABILITY_ID = "image_search"
    NAME = "Image Search"
    DESCRIPTION = "Search for images."
    SUPPORTED_BACKENDS = ['openrouter', 'google']
