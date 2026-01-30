from __future__ import annotations

from atoms_core.src.audio.audio_harmony.service import AudioHarmonyService as CoreAudioHarmonyService
from atoms_core.src.audio.audio_harmony.service import get_audio_harmony_service as get_core_service

class AudioHarmonyService(CoreAudioHarmonyService):
    """Wrapper for core AudioHarmonyService."""
    pass

def get_audio_harmony_service() -> AudioHarmonyService:
    return get_core_service()
