from __future__ import annotations

from typing import List

from atoms_core.src.audio.audio_service.service import get_audio_service as get_core_service
from atoms_core.src.audio.audio_service.models import (
    AlignRequest,
    ArtifactRef,
    AsrRequest,
    BeatFeaturesRequest,
    PreprocessRequest,
    SegmentRequest,
    VoiceEnhanceRequest,
)

class AudioService:
    def preprocess(self, req: PreprocessRequest) -> List[ArtifactRef]:
        return get_core_service().preprocess(req)

    def segment(self, req: SegmentRequest) -> List[ArtifactRef]:
        return get_core_service().segment(req)

    def beat_features(self, req: BeatFeaturesRequest) -> List[ArtifactRef]:
        return get_core_service().beat_features(req)

    def asr(self, req: AsrRequest) -> List[ArtifactRef]:
        return get_core_service().asr(req)

    def align(self, req: AlignRequest) -> ArtifactRef:
        return get_core_service().align(req)

    def voice_enhance(self, req: VoiceEnhanceRequest) -> ArtifactRef:
        return get_core_service().voice_enhance(req)


_default_service: AudioService | None = None


def get_audio_service() -> AudioService:
    global _default_service
    if _default_service is None:
        _default_service = AudioService()
    return _default_service
