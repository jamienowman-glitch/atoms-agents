"""Audio Classification capability."""
from atoms_agents.src.models.capabilities.base_capability import BaseCapability


class AudioClassificationCapability(BaseCapability):
    CAPABILITY_ID = "audio_classification"
    NAME = "Audio Classification"
    DESCRIPTION = "Classify audio content."
    SUPPORTED_BACKENDS = ['huggingface']
