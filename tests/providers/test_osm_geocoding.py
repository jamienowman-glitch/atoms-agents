import os
import pytest
from atoms_agents.src.models.providers.maps.osm.osm_geocoding import OsmGeocodingProvider


@pytest.mark.asyncio
@pytest.mark.skipif(True, reason="OSM endpoint tests require network access")
async def test_osm_geocoding():
    provider = OsmGeocodingProvider()
    result = await provider.lookup_address("1600 Amphitheatre Parkway, Mountain View, CA")
    assert isinstance(result, dict)
