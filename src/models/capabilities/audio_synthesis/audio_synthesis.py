"""Audio Synthesis capability."""
from atoms_agents.src.models.capabilities.base_capability import BaseCapability


class AudioSynthesisCapability(BaseCapability):
    CAPABILITY_ID = "audio_synthesis"
    NAME = "Audio Synthesis"
    DESCRIPTION = "Text-to-speech synthesis."
    SUPPORTED_BACKENDS = ['openai', 'elevenlabs']
