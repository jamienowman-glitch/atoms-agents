from __future__ import annotations

from atoms_core.src.audio.audio_groove.service import AudioGrooveService as CoreAudioGrooveService
from atoms_core.src.audio.audio_groove.service import get_audio_groove_service as get_core_service

class AudioGrooveService(CoreAudioGrooveService):
    """Wrapper for core AudioGrooveService."""
    pass

def get_audio_groove_service() -> AudioGrooveService:
    return get_core_service()
