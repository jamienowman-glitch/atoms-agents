from __future__ import annotations

from atoms_core.src.audio.audio_resample.service import AudioResampleService as CoreAudioResampleService
from atoms_core.src.audio.audio_resample.service import get_audio_resample_service as get_core_service

class AudioResampleService(CoreAudioResampleService):
    """Wrapper for core AudioResampleService."""
    pass

def get_audio_resample_service() -> AudioResampleService:
    return get_core_service()
