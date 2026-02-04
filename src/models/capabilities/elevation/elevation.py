"""Elevation capability."""
from atoms_agents.src.models.capabilities.base_capability import BaseCapability


class ElevationCapability(BaseCapability):
    CAPABILITY_ID = "elevation"
    NAME = "Elevation"
    DESCRIPTION = "Elevation lookup."
    SUPPORTED_BACKENDS = ['google_maps']
