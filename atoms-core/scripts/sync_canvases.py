import os
import asyncio
import yaml
from supabase import create_client, Client
from pathlib import Path

# 1. Config
VAULT_PATH = "/Users/jaynowman/northstar-keys/"
def read_vault(filename):
    with open(os.path.join(VAULT_PATH, filename), "r") as f:
        return f.read().strip()

SUPABASE_URL = read_vault("supabase-url.txt")
SUPABASE_KEY = read_vault("supabase-service-key.txt")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

DEFAULT_CANVAS_REGISTRY_ROOT = (
    Path(__file__).resolve().parents[2] / "_quarantine" / "atoms-registry" / "canvases"
)
CANVAS_REGISTRY_ROOT = Path(os.environ.get("ATOMS_CANVAS_REGISTRY_ROOT", str(DEFAULT_CANVAS_REGISTRY_ROOT)))

async def sync_canvases():
    print(f"🎨 Scanning Canvases at {CANVAS_REGISTRY_ROOT}...")
    
    found_canvases = []
    
    if not CANVAS_REGISTRY_ROOT.exists():
        print(f"⚠️ Registry path not found: {CANVAS_REGISTRY_ROOT}")
        return

    # 1. Scan YAMLs
    for filename in os.listdir(CANVAS_REGISTRY_ROOT):
        if not filename.endswith(".yaml") and not filename.endswith(".yml"):
            continue
            
        filepath = os.path.join(CANVAS_REGISTRY_ROOT, filename)
        try:
            with open(filepath, "r") as f:
                data = yaml.safe_load(f)
                
                # Validation (Basic)
                if "name" not in data:
                     print(f"   ⚠️ Skipping {filename}: Missing 'name'")
                     continue
                
                # Construct DB Entry
                # Filename without extension usually equals key, but let's check content or default
                key = filename.replace(".yaml", "").replace(".yml", "")
                
                canvas_entry = {
                    "key": data.get("key", key), # Prefer internal key, fallback to filename
                    "name": data["name"],
                    "description": data.get("description", "Auto-synced canvas."),
                    "config": data.get("config", {}),
                    "surface_id": data.get("surface_id", "agnx") # Default to agnx if unspecified
                }
                found_canvases.append(canvas_entry)
                print(f"   📜 Found: {canvas_entry['name']}")

        except Exception as e:
            print(f"   ❌ Error reading {filename}: {e}")

    # 2. Upsert
    print(f"💾 Syncing {len(found_canvases)} Canvases to Supabase...")
    for canvas in found_canvases:
        existing = supabase.table("canvases").select("id").eq("key", canvas["key"]).execute()
        
        if existing.data:
            supabase.table("canvases").update({
                "name": canvas["name"],
                "description": canvas["description"],
                "config": canvas["config"],
                "surface_id": canvas.get("surface_id", "agnx")
            }).eq("key", canvas["key"]).execute()
        else:
            supabase.table("canvases").insert(canvas).execute()

    print("✅ Canvas Sync Complete.")

if __name__ == "__main__":
    asyncio.run(sync_canvases())
