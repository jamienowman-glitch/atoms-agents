
import os
import pytest
from tests.providers.utils import random_prompt, has_env_or_vault
from atoms_agents.src.models.providers.openai.gpt_4_1 import GPT41Provider

@pytest.mark.asyncio
@pytest.mark.skipif(not has_env_or_vault('OPENAI_API_KEY'), reason="Required key missing")
async def test_gpt_4_1():
    provider = GPT41Provider()
    result = await provider.generate(random_prompt())
    assert isinstance(result, str)
    assert result.strip()
