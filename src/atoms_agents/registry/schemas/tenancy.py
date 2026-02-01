from typing import Dict, Any, List, Optional, Union
from dataclasses import dataclass, field

@dataclass
class PolicyRule:
    rule_id: str
    severity: str # "FAIL", "WARN"
    applies_to: str # "node", "flow", "execution", "live_calls", "connectors", "artifacts"
    selector: Dict[str, Any] # e.g. {"model_id": "gpt-4"}
    action: str # "FAIL", "WARN"
    message: str

@dataclass
class PolicyPackCard:
    policy_pack_id: str
    rules: List[PolicyRule] = field(default_factory=list)
    card_type: str = "policy_pack"

@dataclass
class BudgetCard:
    budget_id: str
    max_calls_per_run: Optional[int] = None
    max_tokens_per_call: Optional[int] = None
    timeout_seconds: Optional[int] = None
    max_nodes_per_run: Optional[int] = None
    allow_providers: Optional[List[str]] = None # None means all allowed
    allow_models: Optional[List[str]] = None    # None means all allowed
    card_type: str = "budget"

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
