import shutil
from pathlib import Path
from typing import Dict, List, Optional, Union
import yaml

from northstar.registry.schemas import NodeCard, FlowCard
from northstar.core.workspace import WorkspaceManager

CardType = Union[NodeCard, FlowCard]

class WorkspaceStore:
    """
    Manages explicit CRUD operations for the workspace overlay.
    Acts as the single source of truth for writing 'dirty' state.
    """
    def __init__(self, workspace_root: Optional[Path] = None):
        if workspace_root:
            self.workspace = WorkspaceManager(root_dir=workspace_root)
        else:
            self.workspace = WorkspaceManager()
            
        self.root = self.workspace.root_dir
        self._ensure_structure()

    def _ensure_structure(self):
        """Ensure the overlay directory structure exists."""
        (self.root / "nodes").mkdir(parents=True, exist_ok=True)
        (self.root / "flows").mkdir(parents=True, exist_ok=True)

    def write_card(self, card: CardType) -> Path:
        """
        Write a card to the workspace overlay.
        Returns the absolute path of the written file.
        """
        if isinstance(card, NodeCard):
            subdir = "nodes"
            filename = f"{card.node_id}.yaml"
        elif isinstance(card, FlowCard):
            subdir = "flows"
            filename = f"{card.flow_id}.yaml"
        else:
            raise ValueError(f"Unsupported card type: {type(card)}")

        target_path = self.root / subdir / filename
        
        # Ensure parent exists (just in case)
        target_path.parent.mkdir(parents=True, exist_ok=True)

        with open(target_path, "w") as f:
            if hasattr(card, "model_dump"):
                data = card.model_dump(exclude_none=True)
            elif hasattr(card, "__dataclass_fields__"):
                from dataclasses import asdict
                # Custom serializer to filter Nones if desired, but asdict is standard
                # To match Pydantic's exclude_none, we filter manually
                raw = asdict(card)
                data = {k: v for k, v in raw.items() if v is not None}
            else:
                # Fallback assuming dict-like? Or error
                data = dict(card)
                
            yaml.dump(data, f, sort_keys=False)

        return target_path

    def delete_card(self, card_type: str, card_id: str) -> bool:
        """
        Delete a card from the workspace overlay.
        card_type: 'node' or 'flow'
        Returns True if deleted, False if not found.
        """
        if card_type not in ["node", "flow"]:
            raise ValueError("card_type must be 'node' or 'flow'")

        subdir = f"{card_type}s" # nodes or flows
        filename = f"{card_id}.yaml"
        target_path = self.root / subdir / filename

        if target_path.exists():
            target_path.unlink()
            return True
        return False

    def list_overrides(self) -> Dict[str, List[str]]:
        """
        List all IDs currently residing in the workspace overlay.
        Returns: { 'nodes': [id1, ...], 'flows': [id1, ...] }
        """
        result = {"nodes": [], "flows": []}
        
        # List nodes
        nodes_dir = self.root / "nodes"
        if nodes_dir.exists():
            for f in nodes_dir.glob("*.yaml"):
                result["nodes"].append(f.stem)

        # List flows
        flows_dir = self.root / "flows"
        if flows_dir.exists():
            for f in flows_dir.glob("*.yaml"):
                result["flows"].append(f.stem)
        
        return result

    def get_card_path(self, card_type: str, card_id: str) -> Optional[Path]:
        """Return path if exists in workspace, else None."""
        subdir = f"{card_type}s"
        target = self.root / subdir / f"{card_id}.yaml"
        return target if target.exists() else None

    def nuke_all(self):
        """Dangerous: Clears all workspace cards."""
        if self.root.exists():
            shutil.rmtree(self.root)
            self._ensure_structure()
