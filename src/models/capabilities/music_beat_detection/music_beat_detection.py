"""Music Beat Detection capability."""
from atoms_agents.src.models.capabilities.base_capability import BaseCapability


class MusicBeatDetectionCapability(BaseCapability):
    CAPABILITY_ID = "music_beat_detection"
    NAME = "Music Beat Detection"
    DESCRIPTION = "Detect beats in audio."
    SUPPORTED_BACKENDS = ['huggingface']
