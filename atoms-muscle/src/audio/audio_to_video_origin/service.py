from __future__ import annotations

from atoms_core.src.audio.audio_to_video_origin.service import AudioToVideoOriginService as CoreAudioToVideoOriginService
from atoms_core.src.audio.audio_to_video_origin.service import get_audio_to_video_origin_service as get_core_service

class AudioToVideoOriginService(CoreAudioToVideoOriginService):
    """Wrapper for core AudioToVideoOriginService."""
    pass

def get_audio_to_video_origin_service() -> AudioToVideoOriginService:
    return get_core_service()
