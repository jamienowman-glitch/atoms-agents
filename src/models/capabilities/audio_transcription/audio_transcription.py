"""Audio Transcription capability."""
from atoms_agents.src.models.capabilities.base_capability import BaseCapability


class AudioTranscriptionCapability(BaseCapability):
    CAPABILITY_ID = "audio_transcription"
    NAME = "Audio Transcription"
    DESCRIPTION = "Speech-to-text transcription."
    SUPPORTED_BACKENDS = ['openai', 'huggingface', 'elevenlabs']
