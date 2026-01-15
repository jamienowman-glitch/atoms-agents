from dataclasses import dataclass, field
from typing import List, Dict, Any

@dataclass
class FlowCard:
    flow_id: str
    name: str
    objective: str
    nodes: List[str]
    edges: List[Dict[str, str]]
    entry_node: str
    exit_nodes: List[str]
    defaults: Dict[str, Any] = field(default_factory=dict)
    contracts: Dict[str, str] = field(default_factory=dict)
    notes: str = ""
    card_type: str = "flow"
