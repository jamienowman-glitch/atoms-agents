"""Voice Cloning capability."""
from atoms_agents.src.models.capabilities.base_capability import BaseCapability


class VoiceCloningCapability(BaseCapability):
    CAPABILITY_ID = "voice_cloning"
    NAME = "Voice Cloning"
    DESCRIPTION = "Clone a speaker voice."
    SUPPORTED_BACKENDS = ['elevenlabs', 'openai']
