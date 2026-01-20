import os
import sys
import json

# Add repo root to path
sys.path.append(os.getcwd())

from engines.common.identity import RequestContext
from engines.registry.service import get_system_registry_service, get_component_registry_service
from engines.registry.models import RegistryEntry, MaturityLevel

def verify_aggregation():
    print("\n--- Verifying Unified GET /entries Logic ---")
    ctx = RequestContext(tenant_id="t_system", user_id="verifier", env="dev", mode="lab")
    sys_service = get_system_registry_service()
    comp_service = get_component_registry_service()

    results = []
    
    # 1. System Registry Aggregation
    namespaces = ["muscles", "connectors", "agents", "firearms", "kpis"]
    for ns in namespaces:
        entries = sys_service.list_entries(ctx, ns)
        print(f"Namespace '{ns}': {len(entries)} entries")
        results.extend(entries)

    # 2. Component Registry Aggregation (Atoms)
    atoms_payload = comp_service.get_atoms(ctx)
    print(f"Namespace 'atoms': {len(atoms_payload.atoms)} entries")
    
    for atom in atoms_payload.atoms:
        atom_dict = atom.model_dump()
        metadata = atom_dict.get("metadata", {})
        name = metadata.get("label", atom.id)
        
        entry = RegistryEntry(
            id=atom.id,
            namespace="atoms",
            key=atom.id,
            name=name,
            config={
                "defaults": atom.defaults,
                "schema": atom.schema,
                "token_surface": atom.token_surface
            },
            enabled=True,
            tenant_id=ctx.tenant_id,
            maturity=MaturityLevel.PRODUCTION_LITE
        )
        results.append(entry)

    print(f"Total Unified Entries: {len(results)}")
    
    # Sample Output
    if results:
        print("\nSample Atom:")
        sample_atom = next((r for r in results if r.namespace == "atoms"), None)
        if sample_atom:
            print(json.dumps(sample_atom.model_dump(), indent=2, default=str))

        print("\nSample Agent:")
        sample_agent = next((r for r in results if r.namespace == "agents"), None)
        if sample_agent:
            print(json.dumps(sample_agent.model_dump(), indent=2, default=str))


def verify_patch():
    print("\n--- Verifying PATCH Logic ---")
    ctx = RequestContext(tenant_id="t_system", user_id="verifier", env="dev", mode="lab")
    sys_service = get_system_registry_service()
    
    # Test with a Connector
    target_id = "connectors::shopify"
    print(f"Targeting: {target_id}")
    
    namespace, key = target_id.split("::", 1)
    existing = sys_service.repo.get_entry(ctx, namespace, key)
    
    if not existing:
        print("Skipping PATCH test: Target not found.")
        return

    print(f"Original Config Auth Type: {existing.get('config', {}).get('auth_type')}")
    
    # Simulate Update
    current_entry = RegistryEntry.model_validate(existing)
    
    # Update Config
    new_config = {"auth_type": "oauth2_updated_v2"}
    current_entry.config.update(new_config)
    current_entry.maturity = MaturityLevel.PRODUCTION
    
    # Save
    sys_service.upsert_entry(ctx, namespace, current_entry)
    print("Update applied.")
    
    # Verify Persistence
    updated = sys_service.repo.get_entry(ctx, namespace, key)
    print(f"Verified Config Auth Type: {updated.get('config', {}).get('auth_type')}")
    print(f"Verified Maturity: {updated.get('maturity')}")

if __name__ == "__main__":
    verify_aggregation()
    verify_patch()
