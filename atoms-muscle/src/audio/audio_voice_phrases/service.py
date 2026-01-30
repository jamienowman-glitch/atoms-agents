from __future__ import annotations

from atoms_core.src.audio.audio_voice_phrases.service import AudioVoicePhrasesService as CoreAudioVoicePhrasesService
from atoms_core.src.audio.audio_voice_phrases.service import get_audio_voice_phrases_service as get_core_service

class AudioVoicePhrasesService(CoreAudioVoicePhrasesService):
    """Wrapper for core AudioVoicePhrasesService."""
    pass

def get_audio_voice_phrases_service() -> AudioVoicePhrasesService:
    return get_core_service()
