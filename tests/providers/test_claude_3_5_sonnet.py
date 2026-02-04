
import os
import pytest
from tests.providers.utils import random_prompt, has_env_or_vault
from atoms_agents.src.models.providers.anthropic.claude_3_5_sonnet import Claude35SonnetProvider

@pytest.mark.asyncio
@pytest.mark.skipif(not has_env_or_vault('ANTHROPIC_API_KEY'), reason="Required key missing")
async def test_claude_3_5_sonnet():
    provider = Claude35SonnetProvider()
    result = await provider.generate(random_prompt())
    assert isinstance(result, str)
    assert result.strip()
