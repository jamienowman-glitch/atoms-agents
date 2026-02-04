import os
import pytest
import tempfile
from pathlib import Path
from tests.providers.utils import build_dummy_wav, has_env_or_vault
from atoms_agents.src.models.providers.elevenlabs.elevenlabs_speaker_diarization import ElevenLabsSpeakerDiarizationProvider


@pytest.mark.asyncio
@pytest.mark.skipif(not has_env_or_vault('ELEVENLABS_API_KEY'), reason="Required key ELEVENLABS_API_KEY missing")
async def test_elevenlabs_speaker_diarization():
    provider = ElevenLabsSpeakerDiarizationProvider()
    with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as tmp:
        pass
    try:
        build_dummy_wav(Path(tmp.name))
        result = await provider.transcribe_audio(tmp.name, canvas_id=None, thread_id=None, actor_id='test')
    finally:
        Path(tmp.name).unlink(missing_ok=True)
    assert isinstance(result, str)
    assert len(result) >= 0
