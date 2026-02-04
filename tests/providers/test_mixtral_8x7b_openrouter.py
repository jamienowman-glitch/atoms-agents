import os
import pytest
from tests.providers.utils import random_prompt, has_env_or_vault
from atoms_agents.src.models.providers.openrouter.mixtral_8x7b_openrouter import Mixtral8x7bOpenRouterProvider


@pytest.mark.asyncio
@pytest.mark.skipif(not has_env_or_vault('OPENROUTER_API_KEY'), reason="Required key OPENROUTER_API_KEY missing")
async def test_mixtral_8x7b_openrouter():
    provider = Mixtral8x7bOpenRouterProvider()
    result = await provider.generate(random_prompt())
    assert isinstance(result, str)
    assert result.strip()
