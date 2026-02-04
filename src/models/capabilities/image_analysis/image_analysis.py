"""Image Analysis capability."""
from atoms_agents.src.models.capabilities.base_capability import BaseCapability


class ImageAnalysisCapability(BaseCapability):
    CAPABILITY_ID = "image_analysis"
    NAME = "Image Analysis"
    DESCRIPTION = "Vision understanding."
    SUPPORTED_BACKENDS = ['openai', 'google', 'nvidia']
