import json
import os
from typing import Any, Dict, List, Optional
from .blackboard import Blackboard

class LocalBlackboard(Blackboard):
    def __init__(self, persistence_path: Optional[str] = None):
        self._store: Dict[str, Any] = {}
        self.persistence_path = persistence_path

        if self.persistence_path and os.path.exists(self.persistence_path):
            self._load()

    def get(self, key: str) -> Optional[Any]:
        return self._store.get(key)

    def set(self, key: str, value: Any) -> None:
        self._store[key] = value
        if self.persistence_path:
            self._save()

    def delete(self, key: str) -> None:
        if key in self._store:
            del self._store[key]
            if self.persistence_path:
                self._save()

    def list_keys(self) -> List[str]:
        return list(self._store.keys())

    def _save(self) -> None:
        try:
            with open(self.persistence_path, 'w', encoding='utf-8') as f: # type: ignore
                json.dump(self._store, f)
        except Exception as e:
            print(f"Error saving blackboard: {e}")

    def _load(self) -> None:
        try:
            with open(self.persistence_path, 'r', encoding='utf-8') as f: # type: ignore
                self._store = json.load(f)
        except Exception as e:
            print(f"Error loading blackboard: {e}")
