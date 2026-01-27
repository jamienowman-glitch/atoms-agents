import os
import yaml
import glob
from pathlib import Path

# Config
# Adjust paths relative to script location (northstar-engines/scripts)
# We assume dev root is ../../
DEV_ROOT = Path(__file__).parent.parent.parent.resolve()
ATOMS_MUSCLE = DEV_ROOT / "atoms-muscle"
ATOMS_UI = DEV_ROOT / "atoms-ui"
ATOMS_REGISTRY = DEV_ROOT / "_quarantine" / "atoms-registry"

def ensure_dir(path: Path):
    path.mkdir(parents=True, exist_ok=True)

def harvest_muscles():
    """Scans atoms-muscle for spec.yaml and writes to the quarantined file registry (legacy)."""
    print(f"🌾 Harvesting Muscles from {ATOMS_MUSCLE}...")
    print("⚠️  NOTE: File-based atoms-registry is deprecated; prefer DB-backed registries (Supabase).")
    dest_dir = ATOMS_REGISTRY / "muscle"
    ensure_dir(dest_dir)
    
    # Simple recursive glob
    specs = glob.glob(str(ATOMS_MUSCLE / "src" / "**" / "spec.yaml"), recursive=True)
    
    for spec_path in specs:
        try:
            with open(spec_path, 'r') as f:
                data = yaml.safe_load(f)
            
            # Validation: Needs ID and Name
            if not data.get('id'):
                print(f"⚠️  Skipping {spec_path}: No ID found")
                continue
            
            # Standardize Metadata
            entry = {
                "id": f"muscles::{data['id']}", # Namespaced ID
                "namespace": "muscles",
                "key": data['id'],
                "name": data.get('name', data['id']),
                "summary": data.get('description', ''),
                "config": data.get('config', {}),
                "enabled": True,
                "maturity": "experimental",
                "origin_path": str(Path(spec_path).relative_to(DEV_ROOT))
            }
            
            out_path = dest_dir / f"{data['id']}.yaml"
            with open(out_path, 'w') as f:
                yaml.dump(entry, f, sort_keys=False)
            print(f"✅ Harvested {data['id']}")
            
        except Exception as e:
            print(f"❌ Error harvesting {spec_path}: {e}")

def harvest_canvases():
    """Scans the quarantined file registry for Canvas definitions (legacy)."""
    print(f"🌾 Harvesting Canvases from {ATOMS_REGISTRY}/canvases...")
    # Currently we might just be re-formatting them or validating them.
    # If atoms-ui has source-of-truth canvases, we'd scan there.
    # For now, let's assume manual entry in registry or scan a contracts folder?
    pass 

if __name__ == "__main__":
    print("🚀 Starting Registry Harvest...")
    harvest_muscles()
    # harvest_canvases() 
    print("✨ Harvest Complete.")
