import os
import pytest
from tests.providers.utils import has_env_or_vault
from atoms_agents.src.models.providers.maps.google.google_maps_elevation import GoogleMapsElevationProvider


@pytest.mark.asyncio
@pytest.mark.skipif(not has_env_or_vault('GOOGLE_MAPS_API_KEY'), reason="Required key GOOGLE_MAPS_API_KEY missing")
async def test_google_maps_elevation():
    provider = GoogleMapsElevationProvider()
    result = await provider.describe_elevation("40.6892,-74.0445")
    assert isinstance(result, dict)
