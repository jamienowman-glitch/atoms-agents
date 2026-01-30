from __future__ import annotations

from atoms_core.src.audio.audio_arrangement_engine.service import AudioArrangementEngineService as CoreAudioArrangementEngineService
from atoms_core.src.audio.audio_arrangement_engine.service import get_audio_arrangement_engine_service as get_core_service

class AudioArrangementEngineService(CoreAudioArrangementEngineService):
    """Wrapper for core AudioArrangementEngineService."""
    pass

def get_audio_arrangement_engine_service() -> AudioArrangementEngineService:
    return get_core_service()
