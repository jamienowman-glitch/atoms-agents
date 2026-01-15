import shutil
import yaml
from pathlib import Path
from typing import Dict, Any, List, Optional
from dataclasses import dataclass

WORKSPACE_DIR = Path(".northstar/workspace")

@dataclass
class WorkspaceManager:
    root_dir: Path = WORKSPACE_DIR

    def _get_dir(self, card_type: str) -> Path:
        # card_type should be 'nodes' or 'flows'
        path = self.root_dir / card_type
        path.mkdir(parents=True, exist_ok=True)
        return path

    def save_card(self, card_type: str, card_id: str, content: Dict[str, Any]) -> Path:
        """Save a card to the workspace."""
        if card_type not in ["nodes", "flows"]:
            raise ValueError(f"Invalid card type: {card_type}")
        
        directory = self._get_dir(card_type)
        file_path = directory / f"{card_id}.yaml"
        
        with open(file_path, 'w') as f:
            yaml.dump(content, f, sort_keys=False)
            
        return file_path

    def load_card(self, card_type: str, card_id: str) -> Optional[Dict[str, Any]]:
        """Load a card from the workspace if it exists."""
        if card_type not in ["nodes", "flows"]:
            raise ValueError(f"Invalid card type: {card_type}")

        file_path = self._get_dir(card_type) / f"{card_id}.yaml"
        
        if not file_path.exists():
            return None
            
        with open(file_path, 'r') as f:
            return yaml.safe_load(f) # type: ignore

    def list_cards(self, card_type: str) -> List[str]:
        """List all card IDs in the workspace for a given type."""
        directory = self._get_dir(card_type)
        if not directory.exists():
            return []
        return [f.stem for f in directory.glob("*.yaml")]

    def clear(self) -> None:
        """Wipe the workspace directory."""
        if self.root_dir.exists():
            shutil.rmtree(self.root_dir)

    def export(self, output_dir: Path) -> None:
        """Export workspace contents to a target directory."""
        if not self.root_dir.exists():
            print("Workspace is empty.")
            return

        if output_dir.exists():
            raise FileExistsError(f"Output directory {output_dir} already exists.")
            
        shutil.copytree(self.root_dir, output_dir)
