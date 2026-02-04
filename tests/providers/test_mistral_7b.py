import os
import pytest
from tests.providers.utils import random_prompt, has_env_or_vault
from atoms_agents.src.models.providers.mistral.mistral_7b import Mistral7BProvider


@pytest.mark.asyncio
@pytest.mark.skipif(not has_env_or_vault('MISTRAL_API_KEY'), reason="Required key MISTRAL_API_KEY missing")
async def test_mistral_7b():
    provider = Mistral7BProvider()
    result = await provider.generate(random_prompt())
    assert isinstance(result, str)
    assert result.strip()
