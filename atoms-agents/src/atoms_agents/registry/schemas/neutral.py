from dataclasses import dataclass, field
from typing import List, Optional, Any, Dict, Union

@dataclass
class ComponentRef:
    """
    Reference to a Component that can be mounted on a Neutral Node.
    Components are the 'functioning' parts: Agents, Frameworks, Connectors.
    """
    component_type: str  # "agent" | "framework" | "connector" | "capability"
    ref_id: str          # ID of the card being referenced (e.g., "agent.creative_writer")

    # Optional override configuration for this specific mount
    config_overrides: Dict[str, Any] = field(default_factory=dict)

@dataclass
class NeutralNodeCard:
    """
    A Neutral Node is a structural anchor in the graph.
    It has no inherent behavior until Components are mounted and Lenses are applied.
    """
    node_id: str
    label: str

    # Structural Position (for UI/Visualisation)
    position: Dict[str, float] = field(default_factory=lambda: {"x": 0.0, "y": 0.0})

    # Components mounted to this node (The "What")
    components: List[ComponentRef] = field(default_factory=list)

    # Explicit ports for edge connections (Optional, helps with complex routing)
    inputs: List[str] = field(default_factory=list)
    outputs: List[str] = field(default_factory=list)

    notes: str = ""
    card_type: str = "neutral_node"
