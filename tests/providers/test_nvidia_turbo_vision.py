import os
import pytest
from tests.providers.utils import random_prompt, has_env_or_vault
from atoms_agents.src.models.providers.nvidia.nvidia_turbo_vision import NvidiaTurboVisionProvider


@pytest.mark.asyncio
@pytest.mark.skipif(not has_env_or_vault('NVIDIA_API_KEY'), reason="Required key NVIDIA_API_KEY missing")
async def test_nvidia_turbo_vision():
    provider = NvidiaTurboVisionProvider()
    result = await provider.generate(random_prompt())
    assert isinstance(result, str)
    assert result.strip()
