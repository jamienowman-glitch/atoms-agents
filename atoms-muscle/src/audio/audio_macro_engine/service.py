from __future__ import annotations

from atoms_core.src.audio.audio_macro_engine.service import AudioMacroEngineService as CoreAudioMacroEngineService
from atoms_core.src.audio.audio_macro_engine.service import get_audio_macro_engine_service as get_core_service

class AudioMacroEngineService(CoreAudioMacroEngineService):
    """Wrapper for core AudioMacroEngineService."""
    pass

def get_audio_macro_engine_service() -> AudioMacroEngineService:
    return get_core_service()
