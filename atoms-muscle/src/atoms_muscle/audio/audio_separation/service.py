from __future__ import annotations

from atoms_core.src.audio.audio_separation.service import AudioSeparationService as CoreAudioSeparationService
from atoms_core.src.audio.audio_separation.service import get_audio_separation_service as get_core_service

class AudioSeparationService(CoreAudioSeparationService):
    """Wrapper for core AudioSeparationService."""
    pass

def get_audio_separation_service() -> AudioSeparationService:
    return get_core_service()
