from __future__ import annotations

from atoms_core.src.audio.audio_performance_capture.service import AudioPerformanceCaptureService as CoreAudioPerformanceCaptureService
from atoms_core.src.audio.audio_performance_capture.service import get_audio_performance_capture_service as get_core_service

class AudioPerformanceCaptureService(CoreAudioPerformanceCaptureService):
    """Wrapper for core AudioPerformanceCaptureService."""
    pass

def get_audio_performance_capture_service() -> AudioPerformanceCaptureService:
    return get_core_service()
