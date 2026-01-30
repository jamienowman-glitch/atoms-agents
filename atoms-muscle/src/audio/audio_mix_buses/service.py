from __future__ import annotations

from atoms_core.src.audio.audio_mix_buses.service import AudioMixBusesService as CoreAudioMixBusesService
from atoms_core.src.audio.audio_mix_buses.service import get_audio_mix_buses_service as get_core_service

class AudioMixBusesService(CoreAudioMixBusesService):
    """Wrapper for core AudioMixBusesService."""
    pass

def get_audio_mix_buses_service() -> AudioMixBusesService:
    return get_core_service()
