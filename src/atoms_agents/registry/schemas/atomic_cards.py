"""
Legacy shim module.

Atomic card schemas were split into 1-class-per-file modules:
- atoms_agents.registry.schemas.persona.PersonaCard
- atoms_agents.registry.schemas.task.TaskCard
- atoms_agents.registry.schemas.artifact_spec.ArtifactSpecCard

This file remains to avoid breaking older imports.
"""

from atoms_agents.registry.schemas.persona import PersonaCard
from atoms_agents.registry.schemas.task import TaskCard
from atoms_agents.registry.schemas.artifact_spec import ArtifactSpecCard

__all__ = ["PersonaCard", "TaskCard", "ArtifactSpecCard"]
