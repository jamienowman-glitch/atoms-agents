"""Speaker Diarization capability."""
from atoms_agents.src.models.capabilities.base_capability import BaseCapability


class SpeakerDiarizationCapability(BaseCapability):
    CAPABILITY_ID = "speaker_diarization"
    NAME = "Speaker Diarization"
    DESCRIPTION = "Identify speakers in audio."
    SUPPORTED_BACKENDS = ['elevenlabs', 'huggingface']
