
import os
import pytest
from tests.providers.utils import random_prompt, has_env_or_vault, skip_bedrock_unavailable
from atoms_agents.src.models.providers.bedrock.bedrock_titan_image_generator import TitanImageGeneratorBedrockProvider

@pytest.mark.asyncio
@pytest.mark.skipif(not has_env_or_vault('AWS_ACCESS_KEY_ID') or not has_env_or_vault('AWS_SECRET_ACCESS_KEY'), reason="Required key missing")
async def test_bedrock_titan_image_generator():
    provider = TitanImageGeneratorBedrockProvider()
    try:
        result = await provider.generate_image(random_prompt())
    except Exception as exc:
        skip_bedrock_unavailable(exc)
        raise
    assert isinstance(result, dict)
    assert result
