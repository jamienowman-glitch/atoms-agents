import os
import pytest
from tests.providers.utils import has_env_or_vault
from atoms_agents.src.models.providers.maps.google.google_maps_routing import GoogleMapsRoutingProvider


@pytest.mark.asyncio
@pytest.mark.skipif(not has_env_or_vault('GOOGLE_MAPS_API_KEY'), reason="Required key GOOGLE_MAPS_API_KEY missing")
async def test_google_maps_routing():
    provider = GoogleMapsRoutingProvider()
    result = await provider.calculate_route("Times Square, New York, NY", "Central Park, New York, NY")
    assert isinstance(result, dict)
