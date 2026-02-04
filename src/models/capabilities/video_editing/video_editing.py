"""Video Editing capability."""
from atoms_agents.src.models.capabilities.base_capability import BaseCapability


class VideoEditingCapability(BaseCapability):
    CAPABILITY_ID = "video_editing"
    NAME = "Video Editing"
    DESCRIPTION = "Programmatic video editing."
    SUPPORTED_BACKENDS = ['openai', 'huggingface']
