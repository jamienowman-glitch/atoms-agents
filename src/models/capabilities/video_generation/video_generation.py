"""Video Generation capability."""
from atoms_agents.src.models.capabilities.base_capability import BaseCapability


class VideoGenerationCapability(BaseCapability):
    CAPABILITY_ID = "video_generation"
    NAME = "Video Generation"
    DESCRIPTION = "Generate video from text or image."
    SUPPORTED_BACKENDS = ['google', 'openai']
