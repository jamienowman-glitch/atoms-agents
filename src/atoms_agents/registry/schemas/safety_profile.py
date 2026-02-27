from dataclasses import dataclass, field
from typing import List


@dataclass
class SafetyProfileCard:
    """
    SafetyLens: Atomic Safety Allocation.
    Defines safety tiers and guardrails allocated to a node.
    """
    safety_id: str
    tier: str  # high | medium | low | unrestricted
    active_guardrails: List[str] = field(default_factory=list)
    fallback_action: str = "block"  # block | redact | warn
    card_type: str = "lens_safety"

