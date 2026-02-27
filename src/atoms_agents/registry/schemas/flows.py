"""
Legacy shim module.

Flow schemas were split into 1-class-per-file modules:
- atoms_agents.registry.schemas.flow.FlowCard
- atoms_agents.registry.schemas.flow_edge.FlowEdge
"""

from atoms_agents.registry.schemas.flow import FlowCard
from atoms_agents.registry.schemas.flow_edge import FlowEdge

__all__ = ["FlowCard", "FlowEdge"]

