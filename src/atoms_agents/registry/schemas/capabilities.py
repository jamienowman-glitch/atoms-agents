"""
Legacy shim module.

Capability schemas were split into 1-class-per-file modules:
- atoms_agents.registry.schemas.capability.CapabilityCard
- atoms_agents.registry.schemas.capability_binding.CapabilityBindingCard
"""

from atoms_agents.registry.schemas.capability import CapabilityCard
from atoms_agents.registry.schemas.capability_binding import CapabilityBindingCard

__all__ = ["CapabilityCard", "CapabilityBindingCard"]

