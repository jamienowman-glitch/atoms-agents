
import os
import pytest
from tests.providers.utils import random_prompt, has_env_or_vault
from atoms_agents.src.models.providers.google.imagen_3 import Imagen3Provider

@pytest.mark.asyncio
@pytest.mark.skipif(not has_env_or_vault('GOOGLE_API_KEY'), reason="Required key missing")
async def test_imagen_3():
    provider = Imagen3Provider()
    result = await provider.generate_image(random_prompt())
    assert isinstance(result, dict)
