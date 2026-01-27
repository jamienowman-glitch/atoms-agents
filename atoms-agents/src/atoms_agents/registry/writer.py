import os
import yaml
import shutil
from typing import Dict, Any, Optional, List
from atoms_agents.core.workspace import WorkspaceManager

class RegistryWriter:
    """
    Handles safe mutations of Registry Cards (Nodes, Flows).
    Defaults to writing to the Workspace overlay for safety.
    """
    def __init__(self, use_workspace: bool = True):
        self.use_workspace = use_workspace
        self.workspace = WorkspaceManager()

    def _get_path(self, kind: str, card_id: str) -> str:
        # For now, always use workspace for mutations to be safe unless explicitly integrated
        # The user requirement allows workspace overlays.
        # Direct registry mutation would require knowing the exact source path.
        # We will implement workspace-first writing.
        return os.path.join(self.workspace.root_dir, f"{kind}s", f"{card_id}.yaml")

    def _load_or_empty(self, kind: str, card_id: str) -> Dict[str, Any]:
        existing = self.workspace.load_card(f"{kind}s", card_id)
        if existing:
            return existing
        return {}

    def _save(self, kind: str, card_id: str, data: Dict[str, Any]) -> None:
        self.workspace.save_card(f"{kind}s", card_id, data)

    def create_node(self, node_id: str, name: str, kind: str) -> None:
        if not node_id.startswith("node."):
            raise ValueError("Node ID must start with 'node.'")

        card = {
            "card_type": "node",
            "node_id": node_id,
            "name": name,
            "kind": kind,
            "notes": "Created via CLI"
        }
        self._save("node", node_id, card)

    def update_node_fields(self, node_id: str, updates: Dict[str, Any]) -> None:
        card = self._load_or_empty("node", node_id)
        if not card:
            raise ValueError(f"Node {node_id} not found in workspace (cannot update non-existent)")

        for k, v in updates.items():
            if v is not None:
                card[k] = v
        self._save("node", node_id, card)

    def delete_node(self, node_id: str) -> None:
        path = self._get_path("node", node_id)
        if os.path.exists(path):
            os.remove(path)

    def create_flow(self, flow_id: str, name: str, objective: str, entry_node: str) -> None:
        if not flow_id.startswith("flow."):
            raise ValueError("Flow ID must start with 'flow.'")

        card = {
            "card_type": "flow",
            "flow_id": flow_id,
            "name": name,
            "objective": objective,
            "entry_node": entry_node,
            "nodes": [entry_node],
            "edges": [], # List of {from, to}
            "exit_nodes": [],
            "notes": "Created via CLI"
        }
        self._save("flow", flow_id, card)

    def add_flow_edge(self, flow_id: str, from_node: str, to_node: str) -> None:
        card = self._load_or_empty("flow", flow_id)
        if not card:
            raise ValueError(f"Flow {flow_id} not found")

        # Add nodes if missing
        if from_node not in card.get("nodes", []):
            card.setdefault("nodes", []).append(from_node)
        if to_node not in card.get("nodes", []):
            card.setdefault("nodes", []).append(to_node)

        # Add edge
        edges = card.get("edges", [])
        if not any(e["from"] == from_node and e["to"] == to_node for e in edges):
            edges.append({"from": from_node, "to": to_node})
            card["edges"] = edges
            self._save("flow", flow_id, card)

    def remove_flow_edge(self, flow_id: str, from_node: str, to_node: str) -> None:
        card = self._load_or_empty("flow", flow_id)
        if not card:
            raise ValueError(f"Flow {flow_id} not found")

        edges = card.get("edges", [])
        card["edges"] = [e for e in edges if not (e["from"] == from_node and e["to"] == to_node)]
        self._save("flow", flow_id, card)

    def add_flow_node(self, flow_id: str, node_id: str) -> None:
        card = self._load_or_empty("flow", flow_id)
        if not card:
            raise ValueError(f"Flow {flow_id} not found")

        nodes = card.get("nodes", [])
        if node_id not in nodes:
            nodes.append(node_id)
            card["nodes"] = nodes
            self._save("flow", flow_id, card)

    def remove_flow_node(self, flow_id: str, node_id: str) -> None:
        card = self._load_or_empty("flow", flow_id)
        if not card:
             raise ValueError(f"Flow {flow_id} not found")

        # Remove node
        nodes = card.get("nodes", [])
        if node_id in nodes:
            nodes.remove(node_id)
            card["nodes"] = nodes

        # Remove related edges
        edges = card.get("edges", [])
        card["edges"] = [e for e in edges if e["from"] != node_id and e["to"] != node_id]

        self._save("flow", flow_id, card)
