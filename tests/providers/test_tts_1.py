
import os
import pytest
from tests.providers.utils import random_prompt, has_env_or_vault
from atoms_agents.src.models.providers.openai.tts_1 import TTS1Provider

@pytest.mark.asyncio
@pytest.mark.skipif(not has_env_or_vault('OPENAI_API_KEY'), reason="Required key missing")
async def test_tts_1():
    provider = TTS1Provider()
    result = await provider.generate_audio_output(random_prompt())
    assert isinstance(result, dict)
    assert 'audio_url' in result or 'bytes' in result
