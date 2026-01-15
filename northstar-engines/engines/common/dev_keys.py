import json
import os
import logging
from pathlib import Path
from typing import Dict, Any, Optional

logger = logging.getLogger(__name__)

class DevKeyLoader:
    """
    Loads development secrets from local JSON files in <repo_root>/jaynowman/northstar-keys/.
    Do NOT use for production.
    """
    
    def __init__(self, key_name: str):
        """
        key_name: 'youtube' or 'shopify'. Maps to 'jaynowman/northstar-keys/{key_name}.dev.json'
        """
        self.key_name = key_name
        self._cache = None
        
        # Determine path helper
        # We assume this code runs within the repo.
        # <repo>/engines/common/dev_keys.py -> <repo>
        # but let's be robust, look for 'jaynowman/northstar-keys' relative to cwd or specific anchor
        
        # Try to find the repo root
        # Option 1: Env var? No.
        # Option 2: Traverse up from __file__ until .git or anchors found.
        # Option 3: Hardcode relativity assuming standard layout.
        
        root = Path(__file__).resolve().parent.parent.parent
        self.keys_dir = root / "jaynowman/northstar-keys"
        self.file_path = self.keys_dir / f"{key_name}.dev.json"

    def _load(self) -> Dict[str, Any]:
        if self._cache is not None:
            return self._cache
            
        if not self.file_path.exists():
            return {}
            
        try:
            with open(self.file_path, "r") as f:
                data = json.load(f)
                self._cache = data
                return data
        except Exception as e:
            logger.error(f"Failed to load dev keys from {self.file_path}: {e}")
            return {}

    def get(self, field: str) -> Optional[str]:
        data = self._load()
        return data.get(field)
    
    def get_or_error(self, field: str) -> str:
        val = self.get(field)
        if not val:
            raise ValueError(
                f"Missing required key '{field}' in '{self.file_path}'. "
                f"Please see docs/contracts/feeds/DEV_KEYS_SETUP.md"
            )
        return val
