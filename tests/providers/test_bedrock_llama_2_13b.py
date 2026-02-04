
import os
import pytest
from tests.providers.utils import random_prompt, has_env_or_vault, skip_bedrock_unavailable
from atoms_agents.src.models.providers.bedrock.bedrock_llama_2_13b import Llama213BedrockProvider

@pytest.mark.asyncio
@pytest.mark.skipif(not has_env_or_vault('AWS_ACCESS_KEY_ID') or not has_env_or_vault('AWS_SECRET_ACCESS_KEY'), reason="Required key missing")
async def test_bedrock_llama_2_13b():
    provider = Llama213BedrockProvider()
    try:
        result = await provider.generate(random_prompt())
    except Exception as exc:
        skip_bedrock_unavailable(exc)
        raise
    assert isinstance(result, str)
    assert result is not None
