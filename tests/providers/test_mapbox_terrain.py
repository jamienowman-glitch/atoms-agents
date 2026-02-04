import os
import pytest
from tests.providers.utils import has_env_or_vault
from atoms_agents.src.models.providers.maps.mapbox.mapbox_terrain import MapboxTerrainProvider


@pytest.mark.asyncio
@pytest.mark.skipif(not has_env_or_vault('MAPBOX_API_KEY'), reason="Required key MAPBOX_API_KEY missing")
async def test_mapbox_terrain():
    provider = MapboxTerrainProvider()
    result = await provider.describe_terrain(13.4050, 52.5200)
    assert isinstance(result, dict)
