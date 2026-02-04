
import os
import pytest
from tests.providers.utils import random_prompt, has_env_or_vault
from atoms_agents.src.models.providers.google.gemini_2_5_flash_lite import Gemini25FlashLiteProvider

@pytest.mark.asyncio
@pytest.mark.skipif(not has_env_or_vault('GOOGLE_API_KEY'), reason="Required key missing")
async def test_gemini_2_5_flash_lite():
    provider = Gemini25FlashLiteProvider()
    result = await provider.generate(random_prompt())
    assert isinstance(result, str)
    assert result.strip()
