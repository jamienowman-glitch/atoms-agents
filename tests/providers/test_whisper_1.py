import os
import pytest
import tempfile
from pathlib import Path
from tests.providers.utils import build_dummy_wav, has_env_or_vault
from atoms_agents.src.models.providers.openai.whisper_1 import Whisper1Provider

@pytest.mark.asyncio
@pytest.mark.skipif(not has_env_or_vault('OPENAI_API_KEY'), reason="Required key missing")
async def test_whisper_1():
    provider = Whisper1Provider()
    with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as tmp:
        pass
    try:
        build_dummy_wav(Path(tmp.name))
        result = await provider.transcribe_audio(tmp.name, canvas_id=None, thread_id=None, actor_id='test')
    finally:
        Path(tmp.name).unlink(missing_ok=True)
    assert isinstance(result, str)
    assert len(result) >= 0
