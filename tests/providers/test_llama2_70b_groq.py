import os
import pytest
from tests.providers.utils import random_prompt, has_env_or_vault
from atoms_agents.src.models.providers.groq.llama2_70b_groq import Llama270bGroqProvider


@pytest.mark.asyncio
@pytest.mark.skipif(not has_env_or_vault('GROQ_API_KEY'), reason="Required key GROQ_API_KEY missing")
async def test_llama2_70b_groq():
    provider = Llama270bGroqProvider()
    result = await provider.generate(random_prompt())
    assert isinstance(result, str)
    assert result.strip()
