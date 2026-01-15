import sys
import json
from dataclasses import asdict
from typing import Dict, Any
from northstar.registry.schemas import NodeCard

def list_nodes(nodes: Dict[str, Any]) -> None:
    print(f"{'NODE ID':<40} {'NAME':<30} {'KIND'}")
    print("-" * 80)
    for n in nodes.values():
        if isinstance(n, NodeCard):
            print(f"{n.node_id:<40} {n.name:<30} {n.kind}")

def show_node(nodes: Dict[str, Any], node_id: str) -> None:
    if node_id not in nodes:
        print(f"Node '{node_id}' not found.")
        sys.exit(1)
    
    n = nodes[node_id]
    print(json.dumps(asdict(n), indent=2))
