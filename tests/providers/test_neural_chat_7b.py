import os
import pytest
from tests.providers.utils import random_prompt, has_env_or_vault
from atoms_agents.src.models.providers.openrouter.neural_chat_7b import NeuralChat7BProvider


@pytest.mark.asyncio
@pytest.mark.skipif(not has_env_or_vault('OPENROUTER_API_KEY'), reason="Required key OPENROUTER_API_KEY missing")
async def test_neural_chat_7b():
    provider = NeuralChat7BProvider()
    result = await provider.generate(random_prompt())
    assert isinstance(result, str)
    assert result.strip()
