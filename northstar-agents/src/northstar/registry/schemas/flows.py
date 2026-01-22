from dataclasses import dataclass, field
from typing import List, Dict, Any

@dataclass
class FlowEdge:
    edge_id: str
    source: str
    target: str
    source_handle: str = "default"
    target_handle: str = "default"
    connection_handle: str = "default"

@dataclass
class FlowCard:
    flow_id: str
    name: str
    objective: str
    nodes: List[str]
    edges: List[FlowEdge]
    entry_node: str
    exit_nodes: List[str]
    defaults: Dict[str, Any] = field(default_factory=dict)
    contracts: Dict[str, str] = field(default_factory=dict)
    notes: str = ""
    card_type: str = "flow"
