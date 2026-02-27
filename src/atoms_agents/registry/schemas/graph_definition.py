from dataclasses import dataclass, field
from typing import Any, Dict, List

from atoms_agents.registry.schemas.graph_edge import GraphEdge


@dataclass
class GraphDefinitionCard:
    """
    Bundles Neutral Nodes, Edges, and lens application.
    """
    graph_id: str
    name: str
    version: str
    description: str = ""
    nodes: List[Dict[str, Any]] = field(default_factory=list)
    edges: List[GraphEdge] = field(default_factory=list)
    applied_lenses: List[str] = field(default_factory=list)
    initial_state_schema: Dict[str, str] = field(default_factory=dict)
    card_type: str = "graph_def"

    def __post_init__(self):
        parsed_edges: List[GraphEdge] = []
        for e in self.edges:
            if isinstance(e, dict):
                parsed_edges.append(GraphEdge(**e))
            else:
                parsed_edges.append(e)
        self.edges = parsed_edges

