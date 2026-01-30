from __future__ import annotations

from atoms_core.src.audio.audio_structure_engine.service import AudioStructureEngineService as CoreAudioStructureEngineService
from atoms_core.src.audio.audio_structure_engine.service import get_audio_structure_engine_service as get_core_service

class AudioStructureEngineService(CoreAudioStructureEngineService):
    """Wrapper for core AudioStructureEngineService."""
    pass

def get_audio_structure_engine_service() -> AudioStructureEngineService:
    return get_core_service()
