"""
Legacy shim module.

Provider/Model schemas were split into 1-class-per-file modules:
- atoms_agents.registry.schemas.provider_config.ProviderConfigCard
- atoms_agents.registry.schemas.model_family.ModelFamilyCard
- atoms_agents.registry.schemas.model.ModelCard

This file remains to avoid breaking older imports.
"""

from atoms_agents.registry.schemas.provider_config import ProviderConfigCard
from atoms_agents.registry.schemas.model_family import ModelFamilyCard
from atoms_agents.registry.schemas.model import ModelCard

__all__ = ["ProviderConfigCard", "ModelFamilyCard", "ModelCard"]
