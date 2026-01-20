import os
import sys

sys.path.append(os.getcwd())

from engines.common.identity import RequestContext
from engines.registry.service import get_system_registry_service, get_component_registry_service

def verify_registry():
    # Fix: Ensure mode="lab" to allow filesystem usage
    ctx = RequestContext(tenant_id="t_system", user_id="system_crawler", env="dev", mode="lab")
    
    sys_service = get_system_registry_service()
    comp_service = get_component_registry_service()

    print("=== CENTRAL REGISTRY REPORT ===")
    
    # Muscles
    print("\n[Muscles]")
    muscles = sys_service.list_entries(ctx, "muscles")
    for m in muscles:
        print(f" - {m.key} ({m.maturity})")

    # Connectors
    print("\n[Connectors]")
    connectors = sys_service.list_entries(ctx, "connectors")
    for c in sorted(connectors, key=lambda x: x.key):
        print(f" - {c.key} ({c.maturity})")

    # Frontend Components
    print("\n[Lenses]")
    # ComponentRegistryService.list_specs returns RegistrySpecsPayload object
    lenses_payload = comp_service.list_specs(ctx, kind="lens")
    for l in lenses_payload.specs:
         print(f" - {l.id} (Lens)")

    print("\n[Canvases]")
    canvases_payload = comp_service.list_specs(ctx, kind="canvas")
    for c in canvases_payload.specs:
        print(f" - {c.id} (Canvas)")
        
    print("\n[Atoms (Tools)]")
    # atoms are separate
    atoms = comp_service.get_atoms(ctx).atoms
    for a in sorted(atoms, key=lambda x: x.id):
        print(f" - {a.id}")

if __name__ == "__main__":
    verify_registry()
