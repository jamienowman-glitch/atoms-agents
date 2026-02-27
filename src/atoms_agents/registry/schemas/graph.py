"""
Legacy shim module.

GraphLens schemas were split into 1-class-per-file modules:
- atoms_agents.registry.schemas.graph_edge.GraphEdge
- atoms_agents.registry.schemas.graph_definition.GraphDefinitionCard
"""

from atoms_agents.registry.schemas.graph_edge import GraphEdge
from atoms_agents.registry.schemas.graph_definition import GraphDefinitionCard

__all__ = ["GraphEdge", "GraphDefinitionCard"]

