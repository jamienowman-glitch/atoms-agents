"""Routing capability."""
from atoms_agents.src.models.capabilities.base_capability import BaseCapability


class RoutingCapability(BaseCapability):
    CAPABILITY_ID = "routing"
    NAME = "Routing"
    DESCRIPTION = "Directions and routing."
    SUPPORTED_BACKENDS = ['google_maps', 'mapbox', 'osm']
