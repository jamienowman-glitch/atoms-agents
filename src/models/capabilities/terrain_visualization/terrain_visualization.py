"""Terrain Visualization capability."""
from atoms_agents.src.models.capabilities.base_capability import BaseCapability


class TerrainVisualizationCapability(BaseCapability):
    CAPABILITY_ID = "terrain_visualization"
    NAME = "Terrain Visualization"
    DESCRIPTION = "Map terrain visualization."
    SUPPORTED_BACKENDS = ['mapbox', 'google_maps']
