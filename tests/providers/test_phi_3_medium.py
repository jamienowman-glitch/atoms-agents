import os
import pytest
from tests.providers.utils import random_prompt, has_env_or_vault
from atoms_agents.src.models.providers.openrouter.phi_3_medium import Phi3MediumProvider


@pytest.mark.asyncio
@pytest.mark.skipif(not has_env_or_vault('OPENROUTER_API_KEY'), reason="Required key OPENROUTER_API_KEY missing")
async def test_phi_3_medium():
    provider = Phi3MediumProvider()
    result = await provider.generate(random_prompt())
    assert isinstance(result, str)
    assert result.strip()
