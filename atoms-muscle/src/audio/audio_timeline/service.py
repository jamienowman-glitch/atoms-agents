from __future__ import annotations

from atoms_core.src.audio.audio_timeline.service import AudioTimelineService as CoreAudioTimelineService
from atoms_core.src.audio.audio_timeline.service import get_audio_timeline_service as get_core_service

class AudioTimelineService(CoreAudioTimelineService):
    """Wrapper for core AudioTimelineService."""
    pass

def get_audio_timeline_service() -> AudioTimelineService:
    return get_core_service()
