import os
import sys
import re
import json

# Add repo root to path
sys.path.append(os.getcwd())

from engines.common.identity import RequestContext
from engines.registry.service import get_component_registry_service

AG_ROOT = "/Users/jaynowman/dev/agentflow"
TOOL_REGISTRY_PATH = os.path.join(AG_ROOT, "lib/multi21/tool-registry.ts")

def parse_tool_registry():
    """Crude parsing of TS file to extract tool definitions."""
    tools = []
    if not os.path.exists(TOOL_REGISTRY_PATH):
        print(f"Error: Could not find {TOOL_REGISTRY_PATH}")
        return tools

    with open(TOOL_REGISTRY_PATH, 'r') as f:
        content = f.read()

    # Regex to find tool definitions
    # Matches: 'toolId': { ... }
    # We look for the block starting with toolId property inside the object
    
    # Strategy: Find all blocks that look like keys in the registry
    # This is hacky but effective for the fixed format
    
    # We'll just look for the properties we know exist
    # toolId: '...',
    pattern = r"toolId:\s*'([^']+)',\s*label:\s*'([^']+)',\s*surfaceId:\s*'([^']+)',\s*kind:\s*'([^']+)',\s*valueType:\s*'([^']+)',"
    
    matches = re.findall(pattern, content)
    for m in matches:
        tools.append({
            "toolId": m[0],
            "label": m[1],
            "surfaceId": m[2],
            "kind": m[3],
            "valueType": m[4],
            # ignoring allowedOps/options for this pass to keep regex simple
        })
    
    print(f"Parsed {len(tools)} tools from TS file.")
    return tools

def ingest_frontend():
    print("Starting Frontend Registry Ingest...")
    ctx = RequestContext(tenant_id="t_system", user_id="migration_bot", env="dev")
    service = get_component_registry_service()
    
    # 1. Lenses (Harvested from LensRegistry.ts)
    lenses = [
        {"id": "agent_flow", "name": "Agent Flow", "type": "flow"}
    ]
    for l in lenses:
        spec = {
            "id": l["id"],
            "kind": "lens",
            "version": 1,
            "schema": {},
            "defaults": {},
            "controls": {},
            "token_surface": [],
            "metadata": {"name": l["name"], "type": l["type"]}
        }
        print(f"Registering Lens: {l['id']}")
        service.save_spec(ctx, spec)

    # 2. Canvases (Harvested from CanvasRegistry.ts)
    canvases = [
        "video_canvas", "page_canvas", "recap_canvas", "config_canvas"
    ]
    for c in canvases:
        spec = {
            "id": c,
            "kind": "canvas",
            "version": 1,
            "schema": {},
            "defaults": {},
            "controls": {},
            "token_surface": [],
            "metadata": {"label": c.replace("_", " ").title()}
        }
        print(f"Registering Canvas: {c}")
        service.save_spec(ctx, spec)

    # 3. Tools (Parsed from tool-registry.ts)
    tools = parse_tool_registry()
    for t in tools:
        atom = {
            "id": t["toolId"],
            "version": 1,
            "schema": {
                "kind": t["kind"],
                "valueType": t["valueType"]
            },
            "defaults": {},
            "token_surface": [t["surfaceId"]],
            "metadata": {
                "label": t["label"]
            }
        }
        # print(f"Registering Atom: {t['toolId']}") # visual noise
        service.save_atom(ctx, atom)
    
    print(f"Successfully registered {len(tools)} Atoms.")
    print("Frontend Ingest Complete.")

if __name__ == "__main__":
    ingest_frontend()
