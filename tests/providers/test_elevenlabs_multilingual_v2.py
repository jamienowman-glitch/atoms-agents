import os
import pytest
from tests.providers.utils import random_prompt, has_env_or_vault
from atoms_agents.src.models.providers.elevenlabs.elevenlabs_multilingual_v2 import ElevenLabsMultilingualV2Provider


@pytest.mark.asyncio
@pytest.mark.skipif(not has_env_or_vault('ELEVENLABS_API_KEY'), reason="Required key ELEVENLABS_API_KEY missing")
async def test_elevenlabs_multilingual_v2():
    provider = ElevenLabsMultilingualV2Provider()
    result = await provider.generate_audio(random_prompt())
    assert isinstance(result, dict)
    assert 'audio' in result or 'b64' in result
