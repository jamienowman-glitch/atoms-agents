import os
import pytest
from tests.providers.utils import random_prompt, has_env_or_vault
from atoms_agents.src.models.providers.huggingface.mistral_7b_hf import Mistral7bHFProvider


@pytest.mark.asyncio
@pytest.mark.skipif(not has_env_or_vault('HUGGINGFACE_API_KEY'), reason="Required key HUGGINGFACE_API_KEY missing")
async def test_mistral_7b_hf():
    provider = Mistral7bHFProvider()
    result = await provider.generate(random_prompt())
    assert isinstance(result, str)
    assert result.strip()
