from dataclasses import dataclass, field
from typing import List, Dict, Any, Optional

@dataclass
class GraphEdge:
    """
    Directed edge between two Neutral Nodes.
    """
    source_node: str
    target_node: str
    label: Optional[str] = None
    condition: Optional[str] = None # For conditional routing

@dataclass
class GraphDefinitionCard:
    """
    The 'Flow Pack'.
    Bundles Neutral Nodes, Edges, and the application of Lenses.
    This is the installable/sellable unit.
    """
    graph_id: str
    name: str
    version: str
    description: str = ""
    
    # Topology
    nodes: List[Dict[str, Any]] = field(default_factory=list) # Inline NeutralNode definitions or refs
    edges: List[GraphEdge] = field(default_factory=list)
    
    # Lens Layers (Applied to the whole graph or specific nodes)
    # References to Lens Cards
    applied_lenses: List[str] = field(default_factory=list)
    
    # Global 'Blackboard' initialization
    initial_state_schema: Dict[str, str] = field(default_factory=dict)
    
    card_type: str = "graph_def"
    
    def __post_init__(self):
        # Convert dict edges to objects if needed
        parsed_edges = []
        for e in self.edges:
            if isinstance(e, dict):
                parsed_edges.append(GraphEdge(**e))
            else:
                parsed_edges.append(e)
        self.edges = parsed_edges
