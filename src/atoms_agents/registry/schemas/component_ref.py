from dataclasses import dataclass, field
from typing import Any, Dict


@dataclass
class ComponentRef:
    """
    Reference to a Component that can be mounted on a Neutral Node.
    Components are the 'functioning' parts: Agents, Frameworks, Connectors.
    """
    component_type: str  # agent | framework | connector | capability
    ref_id: str
    config_overrides: Dict[str, Any] = field(default_factory=dict)

