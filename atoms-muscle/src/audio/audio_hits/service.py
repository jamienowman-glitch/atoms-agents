from __future__ import annotations

from atoms_core.src.audio.audio_hits.service import AudioHitsService as CoreAudioHitsService
from atoms_core.src.audio.audio_hits.service import get_audio_hits_service as get_core_service

class AudioHitsService(CoreAudioHitsService):
    """Wrapper for core AudioHitsService."""
    pass

def get_audio_hits_service() -> AudioHitsService:
    return get_core_service()
