import os
import sys
import yaml
import datetime

# Add repo root to path
sys.path.append(os.getcwd())

from engines.common.identity import RequestContext
from engines.registry.service import get_system_registry_service
from engines.registry.models import RegistryEntry, MaturityLevel

# Path to Northstar Agents Repo
AGENTS_REPO_PATH = "../northstar-agents"
NODES_PATH = os.path.join(AGENTS_REPO_PATH, "src/northstar/registry/cards/nodes")

def harvest_agents():
    print("Starting Agent Harvest...")
    # Using mode="lab" to rely on filesystem routing
    ctx = RequestContext(tenant_id="t_system", user_id="agent_harvester", env="dev", mode="lab")
    sys_service = get_system_registry_service()

    if not os.path.exists(NODES_PATH):
        print(f"Error: Could not find nodes directory at {NODES_PATH}")
        return

    count = 0
    for filename in os.listdir(NODES_PATH):
        if not filename.endswith(".yaml"):
            continue

        path = os.path.join(NODES_PATH, filename)
        try:
            with open(path, 'r') as f:
                card = yaml.safe_load(f)
            
            # Filter for kind: agent
            if card.get("kind") != "agent":
                continue

            node_id = card.get("node_id")
            name = card.get("name", node_id)
            
            # Construct Agent Metadata
            # User asked for Name, ID, Skill-list.
            # We don't have explicit skills in the node card, defaulting to empty list or deriving.
            # We will store this in the 'config' or main entry.
            
            entry = RegistryEntry(
                id=f"agents::{node_id}",
                namespace="agents",
                key=node_id,
                name=name,
                maturity=MaturityLevel.CONCEPT, # Defaulting to Concept
                config={
                    "skills": [], # Placeholder as per requirement
                    "description": card.get("notes", ""),
                    "persona_ref": card.get("persona_ref"),
                    "task_ref": card.get("task_ref"),
                    "artifact_outputs": card.get("artifact_outputs", [])
                },
                tenant_id="t_system"
            )

            sys_service.upsert_entry(ctx, "agents", entry)
            print(f"Registered Agent: {name} ({node_id})")
            count += 1

        except Exception as e:
            print(f"Failed to process {filename}: {e}")

    print(f"Harvest Complete. Total Agents: {count}")

if __name__ == "__main__":
    harvest_agents()
