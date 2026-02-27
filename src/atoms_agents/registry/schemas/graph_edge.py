from dataclasses import dataclass
from typing import Optional


@dataclass
class GraphEdge:
    """
    Directed edge between two Neutral Nodes.
    """
    source_node: str
    target_node: str
    label: Optional[str] = None
    condition: Optional[str] = None

