from __future__ import annotations

from atoms_core.src.audio.sample_pack_engine.service import SamplePackEngineService as CoreSamplePackEngineService
from atoms_core.src.audio.sample_pack_engine.service import get_sample_pack_engine_service as get_core_service

class SamplePackEngineService(CoreSamplePackEngineService):
    """Wrapper for core SamplePackEngineService."""
    pass

def get_sample_pack_engine_service() -> SamplePackEngineService:
    return get_core_service()
