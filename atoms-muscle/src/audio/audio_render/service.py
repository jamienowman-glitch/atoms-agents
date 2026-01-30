from __future__ import annotations

from atoms_core.src.audio.audio_render.service import AudioRenderService as CoreAudioRenderService
from atoms_core.src.audio.audio_render.service import get_audio_render_service as get_core_service

class AudioRenderService(CoreAudioRenderService):
    """Wrapper for core AudioRenderService."""
    pass

def get_audio_render_service() -> AudioRenderService:
    return get_core_service()
