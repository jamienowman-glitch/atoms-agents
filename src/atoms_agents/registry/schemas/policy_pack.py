from dataclasses import dataclass, field
from typing import List

from atoms_agents.registry.schemas.policy_rule import PolicyRule


@dataclass
class PolicyPackCard:
    policy_pack_id: str
    rules: List[PolicyRule] = field(default_factory=list)
    card_type: str = "policy_pack"

