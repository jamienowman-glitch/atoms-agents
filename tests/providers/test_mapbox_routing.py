import os
import pytest
from tests.providers.utils import has_env_or_vault
from atoms_agents.src.models.providers.maps.mapbox.mapbox_routing import MapboxRoutingProvider


@pytest.mark.asyncio
@pytest.mark.skipif(not has_env_or_vault('MAPBOX_API_KEY'), reason="Required key MAPBOX_API_KEY missing")
async def test_mapbox_routing():
    provider = MapboxRoutingProvider()
    result = await provider.calculate_route("13.388860,52.517037;13.397634,52.529407")
    assert isinstance(result, dict)
