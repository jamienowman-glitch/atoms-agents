from __future__ import annotations

from atoms_core.src.audio.audio_pattern_engine.service import AudioPatternEngineService as CoreAudioPatternEngineService
from atoms_core.src.audio.audio_pattern_engine.service import get_audio_pattern_engine_service as get_core_service

class AudioPatternEngineService(CoreAudioPatternEngineService):
    """Wrapper for core AudioPatternEngineService."""
    pass

def get_audio_pattern_engine_service() -> AudioPatternEngineService:
    return get_core_service()
