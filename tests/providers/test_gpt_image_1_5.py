
import os
import pytest
from tests.providers.utils import random_prompt, has_env_or_vault
from atoms_agents.src.models.providers.openai.gpt_image_1_5 import GPTImage15Provider

@pytest.mark.asyncio
@pytest.mark.skipif(not has_env_or_vault('OPENAI_API_KEY'), reason="Required key missing")
async def test_gpt_image_1_5():
    provider = GPTImage15Provider()
    result = await provider.generate_image_prompt(random_prompt())
    assert isinstance(result, dict)
