from __future__ import annotations

from atoms_core.src.audio.audio_sample_library.service import AudioSampleLibraryService as CoreAudioSampleLibraryService
from atoms_core.src.audio.audio_sample_library.service import get_audio_sample_library_service as get_core_service

class AudioSampleLibraryService(CoreAudioSampleLibraryService):
    """Wrapper for core AudioSampleLibraryService."""
    pass

def get_audio_sample_library_service() -> AudioSampleLibraryService:
    return get_core_service()
