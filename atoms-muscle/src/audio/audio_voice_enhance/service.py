from __future__ import annotations

from atoms_core.src.audio.audio_voice_enhance.service import VoiceEnhanceService as CoreVoiceEnhanceService
from atoms_core.src.audio.audio_voice_enhance.service import get_voice_enhance_service as get_core_service

class VoiceEnhanceService(CoreVoiceEnhanceService):
    """Wrapper for core VoiceEnhanceService."""
    pass

def get_voice_enhance_service() -> VoiceEnhanceService:
    return get_core_service()

def set_voice_enhance_service(service: VoiceEnhanceService) -> None:
    from atoms_core.src.audio.audio_voice_enhance.service import set_voice_enhance_service as set_core
    set_core(service)
