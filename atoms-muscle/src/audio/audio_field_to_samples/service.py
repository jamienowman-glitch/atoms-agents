from __future__ import annotations

from atoms_core.src.audio.audio_field_to_samples.service import AudioFieldToSamplesService as CoreAudioFieldToSamplesService
from atoms_core.src.audio.audio_field_to_samples.service import get_audio_field_to_samples_service as get_core_service

class AudioFieldToSamplesService(CoreAudioFieldToSamplesService):
    """Wrapper for core AudioFieldToSamplesService."""
    pass

def get_audio_field_to_samples_service() -> AudioFieldToSamplesService:
    return get_core_service()
