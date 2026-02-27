from dataclasses import dataclass
from typing import Any, Dict


@dataclass
class PolicyRule:
    rule_id: str
    severity: str  # FAIL | WARN
    applies_to: str  # node | flow | execution | live_calls | connectors | artifacts
    selector: Dict[str, Any]
    action: str  # FAIL | WARN
    message: str

