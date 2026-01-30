from __future__ import annotations

from atoms_core.src.audio.audio_fx_chain.service import AudioFxChainService as CoreAudioFxChainService
from atoms_core.src.audio.audio_fx_chain.service import get_audio_fx_chain_service as get_core_service

class AudioFxChainService(CoreAudioFxChainService):
    """Wrapper for core AudioFxChainService."""
    pass

def get_audio_fx_chain_service() -> AudioFxChainService:
    return get_core_service()
