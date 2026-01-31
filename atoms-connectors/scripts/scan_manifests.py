import os
import yaml
import json
import logging
from pathlib import Path

# Setup
logging.basicConfig(level=logging.INFO)

def scan_manifests():
    # Helper to find root
    # script is in atoms-connectors/scripts/scan_manifests.py
    # src is in atoms-connectors/src
    
    root_dir = Path(__file__).parent.parent / "src"
    
    connectors = []
    
    if not root_dir.exists():
        return []

    # Walk directories
    # Structure: src/{slug}/manifest.yaml
    for item in root_dir.iterdir():
        if item.is_dir():
            manifest_path = item / "manifest.yaml"
            if manifest_path.exists():
                try:
                    with open(manifest_path, 'r') as f:
                        data = yaml.safe_load(f)
                        
                    # Enforce/Normalize some fields
                    connector = {
                        "slug": item.name, # Directory name is the source truth for slug usually
                        "provider_slug": data.get("provider_slug", item.name),
                        "name": data.get("name", item.name.title()),
                        "secrets": data.get("secrets", []), # List of {key, label}
                        "scopes": data.get("scopes", []),
                        "requires_firearm": data.get("requires_firearm", False),
                        "kpis": data.get("kpis", [])
                    }
                    connectors.append(connector)
                except Exception as e:
                    logging.error(f"Error parsing {manifest_path}: {e}")

    print(json.dumps(connectors))

if __name__ == "__main__":
    scan_manifests()
