import os
import yaml
from typing import Optional, Dict

from connectors.models import ConnectorTemplate

class Registry:
    def __init__(self, registry_path: str):
        self.registry_path = registry_path
        self._cache: Dict[str, ConnectorTemplate] = {}

    def get_template(self, provider_slug: str, version: str) -> Optional[ConnectorTemplate]:
        cache_key = f"{provider_slug}:{version}"
        if cache_key in self._cache:
            return self._cache[cache_key]

        file_path = os.path.join(self.registry_path, provider_slug, f"{version}.yaml")
        if not os.path.exists(file_path):
            # Fallback for testing layouts or symlinks if needed, but strict path is safer
            return None

        with open(file_path, "r") as f:
            data = yaml.safe_load(f)

        template = ConnectorTemplate(**data)
        self._cache[cache_key] = template
        return template
