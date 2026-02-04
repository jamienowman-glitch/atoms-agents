import os
import pytest
from tests.providers.utils import random_prompt, has_env_or_vault
from atoms_agents.src.models.providers.elevenlabs.elevenlabs_voice_clone import ElevenLabsVoiceCloneProvider


@pytest.mark.asyncio
@pytest.mark.skipif(not has_env_or_vault('ELEVENLABS_API_KEY'), reason="Required key ELEVENLABS_API_KEY missing")
async def test_elevenlabs_voice_clone():
    provider = ElevenLabsVoiceCloneProvider()
    result = await provider.generate_audio(random_prompt())
    assert isinstance(result, dict)
    assert 'audio' in result or 'b64' in result
