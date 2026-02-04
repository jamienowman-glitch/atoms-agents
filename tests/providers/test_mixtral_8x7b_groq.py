import os
import pytest
from tests.providers.utils import random_prompt, has_env_or_vault
from atoms_agents.src.models.providers.groq.mixtral_8x7b_groq import Mixtral8x7bGroqProvider


@pytest.mark.asyncio
@pytest.mark.skipif(not has_env_or_vault('GROQ_API_KEY'), reason="Required key GROQ_API_KEY missing")
async def test_mixtral_8x7b_groq():
    provider = Mixtral8x7bGroqProvider()
    result = await provider.generate(random_prompt())
    assert isinstance(result, str)
    assert result.strip()
