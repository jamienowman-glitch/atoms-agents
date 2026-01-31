from __future__ import annotations

from atoms_core.src.audio.audio_normalise.service import AudioNormaliseService as CoreAudioNormaliseService
from atoms_core.src.audio.audio_normalise.service import get_audio_normalise_service as get_core_service

class AudioNormaliseService(CoreAudioNormaliseService):
    """Wrapper for core AudioNormaliseService."""
    pass

def get_audio_normalise_service() -> AudioNormaliseService:
    return get_core_service()
