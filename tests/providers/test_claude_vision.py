
import os
import pytest
from tests.providers.utils import random_prompt, has_env_or_vault
from atoms_agents.src.models.providers.anthropic.claude_vision import ClaudeVisionProvider

@pytest.mark.asyncio
@pytest.mark.skipif(not has_env_or_vault('ANTHROPIC_API_KEY'), reason="Required key missing")
async def test_claude_vision():
    provider = ClaudeVisionProvider()
    result = await provider.generate(random_prompt())
    assert isinstance(result, str)
    assert result.strip()
