import os
import pytest
from tests.providers.utils import random_prompt, has_env_or_vault
from atoms_agents.src.models.providers.mistral.mistral_function_calling import MistralFunctionCallingProvider


@pytest.mark.asyncio
@pytest.mark.skipif(not has_env_or_vault('MISTRAL_API_KEY'), reason="Required key MISTRAL_API_KEY missing")
async def test_mistral_function_calling():
    provider = MistralFunctionCallingProvider()
    result = await provider.generate(random_prompt())
    assert isinstance(result, str)
    assert result.strip()
