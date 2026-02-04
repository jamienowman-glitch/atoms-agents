import os
import pytest
from atoms_agents.src.models.providers.maps.osm.osm_routing import OsmRoutingProvider


@pytest.mark.asyncio
@pytest.mark.skipif(True, reason="OSM endpoint tests require network access")
async def test_osm_routing():
    provider = OsmRoutingProvider()
    result = await provider.calculate_route("13.388860,52.517037;13.397634,52.529407")
    assert isinstance(result, dict)
