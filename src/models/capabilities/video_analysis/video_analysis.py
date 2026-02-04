"""Video Analysis capability."""
from atoms_agents.src.models.capabilities.base_capability import BaseCapability


class VideoAnalysisCapability(BaseCapability):
    CAPABILITY_ID = "video_analysis"
    NAME = "Video Analysis"
    DESCRIPTION = "Understand video content."
    SUPPORTED_BACKENDS = ['openai', 'google', 'nvidia']
