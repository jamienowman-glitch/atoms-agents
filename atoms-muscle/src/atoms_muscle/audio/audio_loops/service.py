from __future__ import annotations

from atoms_core.src.audio.audio_loops.service import AudioLoopsService as CoreAudioLoopsService
from atoms_core.src.audio.audio_loops.service import get_audio_loops_service as get_core_service

class AudioLoopsService(CoreAudioLoopsService):
    """Wrapper for core AudioLoopsService."""
    pass

def get_audio_loops_service() -> AudioLoopsService:
    return get_core_service()
