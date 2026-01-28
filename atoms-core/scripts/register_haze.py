import os
import json
import asyncio
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

CONTRACT_PATH = "/Users/jaynowman/dev/atoms-ui/canvases/haze/contract.json"

async def register_haze():
    print(f"🎨 Reading Contract at {CONTRACT_PATH}...")
    
    with open(CONTRACT_PATH, "r") as f:
        data = json.load(f)
        
    meta = data["meta"]
    key = meta["key"]
    
    canvas_entry = {
        "key": key,
        "name": meta["name"],
        "description": meta.get("description", "Haze Nexus Explorer"),
        "config": data, # Store full contract as config
        "structure": {} # Required by DB
        # "surface_id": "agnx" # Column missing in DB
    }
    
    print(f"   📜 Found: {canvas_entry['name']} ({key})")

    # Upsert
    print(f"💾 Syncing to Supabase...")
    
    existing = supabase.table("canvases").select("id").eq("key", key).execute()
    
    if existing.data:
        print("   Updating existing entry...")
        supabase.table("canvases").update({
            "name": canvas_entry["name"],
            "description": canvas_entry["description"],
            "config": canvas_entry["config"],
            # "surface_id": canvas_entry["surface_id"]
        }).eq("key", key).execute()
    else:
        print("   Inserting new entry...")
        supabase.table("canvases").insert(canvas_entry).execute()

    print("✅ Haze Registration Complete.")

if __name__ == "__main__":
    asyncio.run(register_haze())
