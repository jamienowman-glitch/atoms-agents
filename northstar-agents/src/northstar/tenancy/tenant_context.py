from dataclasses import dataclass, field
from typing import List, Optional, Dict, Any

@dataclass
class TenantContext:
    """
    Runtime context for a specific tenant.
    Resolves policies, budgets, and configuration from the registry.
    """
    tenant_id: str
    policy_pack_ids: List[str] = field(default_factory=list)
    budget_id: Optional[str] = None
    nexus_profile_id: Optional[str] = None
    secrets_profile_id: Optional[str] = None
    
    # Resolved objects (loaded by the loader/factory)
    policies: List[Any] = field(default_factory=list) # List[PolicyPackCard]
    budget: Optional[Any] = None # BudgetCard
    
    # Effective configuration derived from policies/budget
    allow_live: bool = True # Default, can be restricted by policy
