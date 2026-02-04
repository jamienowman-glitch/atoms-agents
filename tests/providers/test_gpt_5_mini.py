
import os
import pytest
from tests.providers.utils import random_prompt, has_env_or_vault
from atoms_agents.src.models.providers.openai.gpt_5_mini import GPT5MiniProvider

@pytest.mark.asyncio
@pytest.mark.skipif(not has_env_or_vault('OPENAI_API_KEY'), reason="Required key missing")
async def test_gpt_5_mini():
    provider = GPT5MiniProvider()
    result = await provider.generate(random_prompt())
    assert isinstance(result, str)
    assert result.strip()
