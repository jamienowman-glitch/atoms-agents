from dataclasses import dataclass, field
from typing import Dict, List

from atoms_agents.registry.schemas.component_ref import ComponentRef


@dataclass
class NeutralNodeCard:
    """
    A Neutral Node is a structural anchor in the graph.
    It has no inherent behavior until Components are mounted and Lenses are applied.
    """
    node_id: str
    label: str
    position: Dict[str, float] = field(default_factory=lambda: {"x": 0.0, "y": 0.0})
    components: List[ComponentRef] = field(default_factory=list)
    inputs: List[str] = field(default_factory=list)
    outputs: List[str] = field(default_factory=list)
    notes: str = ""
    card_type: str = "neutral_node"

