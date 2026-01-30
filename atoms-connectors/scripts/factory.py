import yaml
from pathlib import Path
from typing import List, Optional
from pydantic import BaseModel, Field, ValidationError
from jinja2 import Template

class Scope(BaseModel):
    name: str
    requires_firearm: bool = False
    firearm_type: Optional[str] = None
    description: Optional[str] = None

class KPI(BaseModel):
    raw: str
    standard: str

class Manifest(BaseModel):
    provider_slug: str
    display_name: str
    scopes: List[Scope] = Field(default_factory=list)
    kpis: List[KPI] = Field(default_factory=list)
    naming_rule: str = "standard"
    auth_mode: Optional[str] = None # Added based on AGENTS.md example, though not strictly in plan schema, useful to allow

def load_manifest(path: Path) -> Manifest:
    """Reads and validates the manifest file."""
    if not path.exists():
        raise FileNotFoundError(f"Manifest not found at {path}")

    with open(path, "r") as f:
        data = yaml.safe_load(f)

    try:
        return Manifest(**data)
    except ValidationError as e:
        raise ValueError(f"Manifest validation error in {path}: {e}")

def generate_mcp(manifest: Manifest) -> str:
    """Generates the content for mcp.py."""
    template_str = """from mcp.server.fastmcp import FastMCP
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Assuming the service is defined in service.py and has a Service class or similar entry point
try:
    from .service import Service
except ImportError:
    # Fallback for generated files where service.py might not be ready
    class Service:
        def run(self, action: str, **kwargs):
            logger.warning(f"Service not implemented. Action: {action}")
            return {"status": "not_implemented", "action": action}

mcp = FastMCP("connector-{{ manifest.provider_slug }}")
service = Service()

@mcp.tool()
def execute(action: str, **kwargs) -> dict:
    \"\"\"
    Executes a connector action.

    Args:
        action: The action to perform (e.g., 'read_orders').
        **kwargs: Arguments for the action.
    \"\"\"
    return service.run(action, **kwargs)

if __name__ == "__main__":
    mcp.run()
"""
    template = Template(template_str)
    return template.render(manifest=manifest).strip()
