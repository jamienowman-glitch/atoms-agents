import os
import pytest
from tests.providers.utils import random_prompt, has_env_or_vault
from atoms_agents.src.models.providers.huggingface.stable_diffusion_xl import StableDiffusionXlProvider


@pytest.mark.asyncio
@pytest.mark.skipif(not has_env_or_vault('HUGGINGFACE_API_KEY'), reason="Required key HUGGINGFACE_API_KEY missing")
async def test_stable_diffusion_xl():
    provider = StableDiffusionXlProvider()
    result = await provider.generate_image(random_prompt())
    assert isinstance(result, dict)
    assert 'images' in result
