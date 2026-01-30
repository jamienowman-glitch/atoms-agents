from __future__ import annotations

from atoms_core.src.audio.audio_semantic_timeline.service import AudioSemanticService as CoreAudioSemanticService
from atoms_core.src.audio.audio_semantic_timeline.service import get_audio_semantic_service as get_core_service

class AudioSemanticService(CoreAudioSemanticService):
    """Wrapper for core AudioSemanticService."""
    pass

def get_audio_semantic_service() -> AudioSemanticService:
    return get_core_service()
