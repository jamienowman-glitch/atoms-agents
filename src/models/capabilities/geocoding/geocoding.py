"""Geocoding capability."""
from atoms_agents.src.models.capabilities.base_capability import BaseCapability


class GeocodingCapability(BaseCapability):
    CAPABILITY_ID = "geocoding"
    NAME = "Geocoding"
    DESCRIPTION = "Address lookup."
    SUPPORTED_BACKENDS = ['google_maps', 'mapbox', 'osm']
