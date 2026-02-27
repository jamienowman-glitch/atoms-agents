from dataclasses import dataclass, field
from typing import List, Optional


@dataclass
class TenantCard:
    tenant_id: str
    name: str
    policy_pack_refs: List[str] = field(default_factory=list)
    budget_ref: Optional[str] = None
    nexus_profile_ref: Optional[str] = None
    secrets_profile_ref: Optional[str] = None
    default_overlays: List[str] = field(default_factory=list)
    card_type: str = "tenant"

