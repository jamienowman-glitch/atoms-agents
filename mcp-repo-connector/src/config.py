import yaml
import os
from typing import Dict, List, Optional, Literal
from pydantic import BaseModel, Field

# Defines a single workspace (either a repo or the root)
class Workspace(BaseModel):
    id: str
    root_path: str
    kind: Literal["repo", "root"]
    display_name: str

class GlobalConfig(BaseModel):
    root_path: str = "/Users/jaynowman/dev"
    enable_writes: bool = False
    audit_log_path: str = "audit.log"
    port: int = 8000
    host: str = "0.0.0.0" # Bind to all interfaces for reliability with tunnels
    
    # Internal dynamic state
    _discovered_workspaces: Dict[str, Workspace] = {}

class ConfigLoader:
    _instance: Optional[GlobalConfig] = None

    @classmethod
    def load(cls, config_path: str = "config.yaml") -> GlobalConfig:
        if os.path.exists(config_path):
            with open(config_path, 'r') as f:
                data = yaml.safe_load(f) or {}
        else:
            data = {}
        
        # Ensure minimal defaults if file is empty or missing keys
        if "root_path" not in data:
            data["root_path"] = "/Users/jaynowman/dev"
            
        config = GlobalConfig(**data)
        config.root_path = os.path.expanduser(config.root_path)
            
        cls._instance = config
        return config

    @classmethod
    def get(cls) -> GlobalConfig:
        if cls._instance is None:
            # Auto-load if accessed before explicit load
            return cls.load()
        return cls._instance
