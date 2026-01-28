from typing import List, Dict, Any, Set
try:
    from graphlib import TopologicalSorter
except ImportError:
    # Basic fallback for python < 3.9 if needed, but project is 3.12
    pass

class DAGValidator:
    @staticmethod
    def validate_dag(nodes: List[str], edges: List[Any], entry_node: str, exit_nodes: List[str]) -> List[str]:
        node_set = set(nodes)

        # 1. Validate Nodes Exist
        if entry_node not in node_set:
            raise ValueError(f"Entry node '{entry_node}' not found in nodes list.")

        for ex in exit_nodes:
            if ex not in node_set:
                raise ValueError(f"Exit node '{ex}' not found in nodes list.")

        # 2. Build Adjacency List
        adj: Dict[str, Set[str]] = {n: set() for n in nodes}
        for edge in edges:
            if isinstance(edge, dict):
                 u, v = edge['from'], edge['to']
            else:
                 u, v = edge.source, edge.target
            if u not in node_set:
                raise ValueError(f"Edge source '{u}' not found in nodes list.")
            if v not in node_set:
                raise ValueError(f"Edge target '{v}' not found in nodes list.")
            adj[u].add(v)

        # 3. Cycle Detection & Topo Sort
        # graphlib.TopologicalSorter handles this efficiently
        # It expects a dict of node -> predecessors
        predecessors: Dict[str, Set[str]] = {n: set() for n in nodes}
        for u in adj:
            for v in adj[u]:
                predecessors[v].add(u)

        try:
            ts = TopologicalSorter(predecessors)
            return list(ts.static_order())
        except Exception as e:
            raise ValueError(f"DAG Validation Failed (Cycle detected?): {e}")

    @staticmethod
    def validate_flow_integrity(flow_card: Any, registry_nodes: Dict[str, Any]) -> None:
        """Ensures all nodes referenced in the flow exist in the registry."""
        for node_id in flow_card.nodes:
            if node_id not in registry_nodes:
                raise ValueError(f"Flow references missing node: {node_id}")
