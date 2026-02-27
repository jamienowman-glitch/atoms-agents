from dataclasses import dataclass


@dataclass
class FlowEdge:
    edge_id: str
    source: str
    target: str
    source_handle: str = "default"
    target_handle: str = "default"
    connection_handle: str = "default"

