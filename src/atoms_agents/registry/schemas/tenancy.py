"""
Legacy shim module.

Tenancy schemas were split into 1-class-per-file modules:
- atoms_agents.registry.schemas.policy_rule.PolicyRule
- atoms_agents.registry.schemas.policy_pack.PolicyPackCard
- atoms_agents.registry.schemas.budget.BudgetCard
- atoms_agents.registry.schemas.tenant.TenantCard
"""

from atoms_agents.registry.schemas.policy_rule import PolicyRule
from atoms_agents.registry.schemas.policy_pack import PolicyPackCard
from atoms_agents.registry.schemas.budget import BudgetCard
from atoms_agents.registry.schemas.tenant import TenantCard

__all__ = ["PolicyRule", "PolicyPackCard", "BudgetCard", "TenantCard"]

