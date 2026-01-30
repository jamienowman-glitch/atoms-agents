from __future__ import annotations

from atoms_core.src.audio.audio_mix_snapshot.service import AudioMixSnapshotService as CoreAudioMixSnapshotService
from atoms_core.src.audio.audio_mix_snapshot.service import get_audio_mix_snapshot_service as get_core_service

class AudioMixSnapshotService(CoreAudioMixSnapshotService):
    """Wrapper for core AudioMixSnapshotService."""
    pass

def get_audio_mix_snapshot_service() -> AudioMixSnapshotService:
    return get_core_service()
