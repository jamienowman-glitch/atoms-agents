"""
Legacy shim module.

Neutral node schemas were split into 1-class-per-file modules:
- atoms_agents.registry.schemas.component_ref.ComponentRef
- atoms_agents.registry.schemas.neutral_node.NeutralNodeCard
"""

from atoms_agents.registry.schemas.component_ref import ComponentRef
from atoms_agents.registry.schemas.neutral_node import NeutralNodeCard

__all__ = ["ComponentRef", "NeutralNodeCard"]

