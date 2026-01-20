import os
import yaml
import sys
import re
import uuid
import datetime

# Add repo root to path
sys.path.append(os.getcwd())

from engines.common.identity import RequestContext
from engines.registry.service import get_system_registry_service, get_component_registry_service
from engines.registry.models import RegistryEntry, MaturityLevel
from engines.routing.registry import ResourceRoute, FileSystemRoutingRegistry

AG_ROOT = "/Users/jaynowman/dev/agentflow"
TOOL_REGISTRY_PATH = os.path.join(AG_ROOT, "lib/multi21/tool-registry.ts")

def bootstrap_routes(ctx: RequestContext):
    """Ensure routes exist using direct filesystem access (bypass service checks)."""
    print("Bootstrapping routes (Direct FS)...")
    # Use direct registry to avoid Service->Timeline->EventStream catch-22
    registry = FileSystemRoutingRegistry()
    
    # 1. Component Registry
    # Check if route exists matching the exact context (including project_id)
    existing = registry.get_route("component_registry", ctx.tenant_id, ctx.env, ctx.project_id)
    if not existing:
        print(f"Creating missing route for component_registry ({ctx.tenant_id}/{ctx.env}/{ctx.project_id})...")
        route = ResourceRoute(
            id=str(uuid.uuid4()),
            resource_kind="component_registry",
            tenant_id=ctx.tenant_id,
            env=ctx.env,
            project_id=ctx.project_id,
            backend_type="filesystem",
            config={"base_path": "./data/registry"},
            required=True,
            created_at=datetime.datetime.now(),
            updated_at=datetime.datetime.now()
        )
        registry.upsert_route(route)
        print("Route created: component_registry")
    else:
        print("Route exists: component_registry")

    # 2. Event Stream
    existing_stream = registry.get_route("event_stream", ctx.tenant_id, ctx.env, ctx.project_id)
    if not existing_stream:
        print(f"Creating missing route for event_stream ({ctx.tenant_id}/{ctx.env}/{ctx.project_id})...")
        route = ResourceRoute(
            id=str(uuid.uuid4()),
            resource_kind="event_stream",
            tenant_id=ctx.tenant_id,
            env=ctx.env,
            project_id=ctx.project_id,
            backend_type="filesystem",
            config={"base_path": "./data/events"},
            required=True,
            created_at=datetime.datetime.now(),
            updated_at=datetime.datetime.now()
        )
        registry.upsert_route(route)
        print("Route created: event_stream")
    else:
        print("Route exists: event_stream")

def parse_tool_registry():
    """Crude parsing of TS file to extract tool definitions."""
    tools = []
    if not os.path.exists(TOOL_REGISTRY_PATH):
        print(f"Warning: Could not find {TOOL_REGISTRY_PATH}")
        return tools

    with open(TOOL_REGISTRY_PATH, 'r') as f:
        content = f.read()

    # Regex to find tool definitions
    pattern = r"toolId:\s*'([^']+)',\s*label:\s*'([^']+)',\s*surfaceId:\s*'([^']+)',\s*kind:\s*'([^']+)',\s*valueType:\s*'([^']+)',"
    
    matches = re.findall(pattern, content)
    for m in matches:
        tools.append({
            "toolId": m[0],
            "label": m[1],
            "surfaceId": m[2],
            "kind": m[3],
            "valueType": m[4],
        })
    return tools

def seed_registry():
    print("Starting Registry Seed...")
    # Fix: Ensure mode="lab" to allow filesystem usage
    ctx = RequestContext(tenant_id="t_system", user_id="system_crawler", env="dev", mode="lab")
    
    # Bootstrap Routes FIRST
    bootstrap_routes(ctx)

    sys_service = get_system_registry_service()
    comp_service = get_component_registry_service()

    counts = {
        "muscles": 0,
        "connectors": 0,
        "lenses": 0,
        "canvases": 0,
        "atoms": 0
    }

    # 1. Scan Muscles
    muscles_dir = "engines/muscle"
    if os.path.exists(muscles_dir):
        for name in os.listdir(muscles_dir):
            path = os.path.join(muscles_dir, name)
            spec_path = os.path.join(path, "spec.yaml")
            mcp_spec = os.path.join(path, "mcp", "spec.yaml")

            if not os.path.exists(spec_path) and os.path.exists(mcp_spec):
                spec_path = mcp_spec

            if os.path.exists(spec_path):
                try:
                    with open(spec_path, "r") as f:
                        spec = yaml.safe_load(f)

                    entry_id = spec.get("id", name)
                    maturity = spec.get("maturity", "concept")

                    try:
                        mat_enum = MaturityLevel(maturity)
                    except ValueError:
                        mat_enum = MaturityLevel.CONCEPT

                    config = {}
                    if "scopes" in spec:
                        config["scopes"] = spec["scopes"]
                    if "mcp_config" in spec:
                        config["mcp_config"] = spec["mcp_config"]

                    entry = RegistryEntry(
                        id=f"muscles::{entry_id}",
                        namespace="muscles",
                        key=entry_id,
                        name=spec.get("name", entry_id),
                        config=config,
                        maturity=mat_enum,
                        next_steps=spec.get("next_steps", []),
                        tenant_id="t_system"
                    )

                    sys_service.upsert_entry(ctx, "muscles", entry)
                    counts["muscles"] += 1

                except Exception as e:
                    print(f"Failed to process muscle {name}: {e}")

    # 2. Scan Connectors
    connectors_dir = "engines/connectors"
    if os.path.exists(connectors_dir):
        for name in os.listdir(connectors_dir):
            path = os.path.join(connectors_dir, name)
            spec_path = os.path.join(path, "spec.yaml")
            if os.path.exists(spec_path):
                 try:
                    with open(spec_path, "r") as f:
                        spec = yaml.safe_load(f)

                    entry_id = spec.get("id", name)
                    maturity = spec.get("maturity", "concept")
                    try:
                        mat_enum = MaturityLevel(maturity)
                    except ValueError:
                        mat_enum = MaturityLevel.CONCEPT

                    config = spec.get("config", {})
                    # PATCH: Ensure auth_type exists for validation
                    if "auth_type" not in config:
                        config["auth_type"] = "none"

                    entry = RegistryEntry(
                        id=f"connectors::{entry_id}",
                        namespace="connectors",
                        key=entry_id,
                        name=spec.get("name", entry_id),
                        config=config,
                        maturity=mat_enum,
                        next_steps=spec.get("next_steps", []),
                        tenant_id="t_system"
                    )
                    sys_service.upsert_entry(ctx, "connectors", entry)
                    counts["connectors"] += 1
                 except Exception as e:
                    print(f"Failed to process connector {name}: {e}")

    # 3. Harvest Frontend (Lenses, Canvases, Tools)
    # 3a. Lenses
    lenses = [{"id": "agent_flow", "name": "Agent Flow", "type": "flow"}]
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
        try:
            comp_service.save_spec(ctx, spec)
            counts["lenses"] += 1
        except Exception as e:
            print(f"Failed to register lens {l['id']}: {e}")

    # 3b. Canvases
    canvases = ["video_canvas", "page_canvas", "recap_canvas", "config_canvas", "stigma_canvas"]
    for c in canvases:
        metadata = {"label": c.replace("_", " ").title()}
        if c == "stigma_canvas":
            metadata.update({
                "type": "freeform",
                "axis": "XY",
                "grid": "12-column-editorial"
            })
            
        spec = {
            "id": c,
            "kind": "canvas",
            "version": 1,
            "schema": {},
            "defaults": {},
            "controls": {},
            "token_surface": [],
            "metadata": metadata
        }
        try:
            comp_service.save_spec(ctx, spec)
            counts["canvases"] += 1
        except Exception as e:
            print(f"Failed to register canvas {c}: {e}")

    # 3c. Tools (Atoms)
    tools = parse_tool_registry()
    
    # Inject Stigma Shell Atoms
    stigma_atoms = ["stigma.shape", "stigma.text", "stigma.image"]
    for sa in stigma_atoms:
        tools.append({
            "toolId": sa,
            "label": sa.split(".")[1].title(),
            "surfaceId": "stigma_canvas", # Associate with the new canvas
            "kind": "atom",
            "valueType": "object"
        })

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
        try:
            comp_service.save_atom(ctx, atom)
            counts["atoms"] += 1
        except Exception as e:
            print(f"Failed to register atom {t['toolId']}: {e}")

    print("\n--- Seeding Report ---")
    print(f"Muscles:    {counts['muscles']}")
    print(f"Connectors: {counts['connectors']}")
    print(f"Lenses:     {counts['lenses']}")
    print(f"Canvases:   {counts['canvases']}")
    print(f"Atoms:      {counts['atoms']}")
    print("----------------------")

if __name__ == "__main__":
    seed_registry()
