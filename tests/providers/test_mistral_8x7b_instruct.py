import os
import pytest
from tests.providers.utils import random_prompt, has_env_or_vault
from atoms_agents.src.models.providers.openrouter.mistral_8x7b_instruct import Mistral8x7bInstructProvider


@pytest.mark.asyncio
@pytest.mark.skipif(not has_env_or_vault('OPENROUTER_API_KEY'), reason="Required key OPENROUTER_API_KEY missing")
async def test_mistral_8x7b_instruct():
    provider = Mistral8x7bInstructProvider()
    result = await provider.generate(random_prompt())
    assert isinstance(result, str)
    assert result.strip()
