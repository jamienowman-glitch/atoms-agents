import os
import yaml
import sys

# Add repo root to path
sys.path.append(os.getcwd())

from engines.common.identity import RequestContext
from engines.registry.service import get_system_registry_service
from engines.registry.models import RegistryEntry, MaturityLevel

def seed_registry():
    print("Starting Registry Seed...")
    ctx = RequestContext(tenant_id="t_system", user_id="system_crawler", env="dev")
    service = get_system_registry_service()

    # 1. Scan Muscles
    muscles_dir = "engines/muscle"
    if os.path.exists(muscles_dir):
        for name in os.listdir(muscles_dir):
            path = os.path.join(muscles_dir, name)
            spec_path = os.path.join(path, "spec.yaml")
            # Also check mcp/spec.yaml as per some comments?
            # Task B2 created engines/muscle/video_render/spec.yaml

            if not os.path.exists(spec_path):
                # Check mcp/spec.yaml?
                mcp_spec = os.path.join(path, "mcp", "spec.yaml")
                if os.path.exists(mcp_spec):
                    spec_path = mcp_spec

            if os.path.exists(spec_path):
                try:
                    with open(spec_path, "r") as f:
                        spec = yaml.safe_load(f)

                    entry_id = spec.get("id", name)
                    maturity = spec.get("maturity", "concept")

                    # Convert string maturity to Enum
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

                    print(f"Registering muscle: {entry.key} ({entry.maturity})")
                    service.upsert_entry(ctx, "muscles", entry)

                except Exception as e:
                    print(f"Failed to process {name}: {e}")

    # 2. Scan Connectors (Placeholder if dir exists)
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
                     # Convert string maturity to Enum
                    try:
                        mat_enum = MaturityLevel(maturity)
                    except ValueError:
                        mat_enum = MaturityLevel.CONCEPT

                    config = spec.get("config", {})
                    # Ensure auth_type if needed by validation

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
                    print(f"Registering connector: {entry.key}")
                    service.upsert_entry(ctx, "connectors", entry)
                 except Exception as e:
                    print(f"Failed to process connector {name}: {e}")

    print("Seeding Complete.")

if __name__ == "__main__":
    seed_registry()
