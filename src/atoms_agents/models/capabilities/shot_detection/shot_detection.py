"""Shot Detection capability."""
from atoms_agents.models.capabilities.base_capability import BaseCapability


class ShotDetectionCapability(BaseCapability):
    CAPABILITY_ID = "shot_detection"
    NAME = "Shot Detection"
    DESCRIPTION = "Detect scene changes."
    SUPPORTED_BACKENDS = ['huggingface']
