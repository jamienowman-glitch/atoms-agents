import os
from typing import Dict
from northstar.registry.loader import RegistryLoader, RegistryContext
from northstar.registry.schemas import (
    ModeCard, 
    ProviderConfigCard, 
    ModelCard, 
    CapabilityCard, 
    CapabilityBindingCard, 
    PersonaCard, 
    TaskCard, 
    ArtifactSpecCard, 
    NodeCard, 
    FlowCard,
    RunProfileCard
)
from northstar.registry.schemas.overlays import LensOverlayCard
from northstar.registry.schemas.tenancy import TenantCard, PolicyPackCard, BudgetCard

def load_registry_for_cli() -> RegistryContext:
    # Initialize loader
    cards_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "../registry/cards"))
    loader = RegistryLoader(cards_root)
    
    
    return loader.load_context()
