"""
Legacy shim module.

Framework/mode schemas were split into 1-class-per-file modules:
- atoms_agents.registry.schemas.framework_adapter.FrameworkAdapterCard
- atoms_agents.registry.schemas.mode.ModeCard
"""

from atoms_agents.registry.schemas.framework_adapter import FrameworkAdapterCard
from atoms_agents.registry.schemas.mode import ModeCard

__all__ = ["FrameworkAdapterCard", "ModeCard"]

