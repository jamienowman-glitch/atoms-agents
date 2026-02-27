from dataclasses import dataclass, field
from typing import Any, Dict


@dataclass
class CapabilityCard:
    capability_id: str
    capability_name: str
    description: str = ""
    embedded_or_separate: str = "EMBEDDED"
    parameters: Dict[str, Any] = field(default_factory=dict)
    card_type: str = "capability"
