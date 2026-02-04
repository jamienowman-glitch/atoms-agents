"""Audio Stem Separation capability."""
from atoms_agents.src.models.capabilities.base_capability import BaseCapability


class AudioStemSeparationCapability(BaseCapability):
    CAPABILITY_ID = "audio_stem_separation"
    NAME = "Audio Stem Separation"
    DESCRIPTION = "Separate audio stems."
    SUPPORTED_BACKENDS = ['huggingface']
