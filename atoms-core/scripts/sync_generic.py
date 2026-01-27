import os
import asyncio
import yaml
import sys
from supabase import create_client, Client

# Config
VAULT_PATH = "/Users/jaynowman/northstar-keys/"
def read_vault(filename):
    with open(os.path.join(VAULT_PATH, filename), "r") as f:
        return f.read().strip()

SUPABASE_URL = read_vault("supabase-url.txt")
SUPABASE_KEY = read_vault("supabase-service-key.txt")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

async def sync_generic(target_dir, table_name):
    print(f"🔄 Scanning Generic Registry: {table_name}...")
    print(f"   📂 Path: {target_dir}")
    
    found_items = []
    
    if not os.path.exists(target_dir):
        print(f"⚠️ Path not found: {target_dir}")
        return

    # 1. Scan YAMLs
    for filename in os.listdir(target_dir):
        if not filename.endswith(".yaml") and not filename.endswith(".yml"):
            continue
            
        filepath = os.path.join(target_dir, filename)
        try:
            with open(filepath, "r") as f:
                data = yaml.safe_load(f)
                
                # Basic Validation: Needs 'name' usually
                if "name" not in data and "key" not in data:
                     # Attempt to infer key from filename if missing
                     data["key"] = filename.replace(".yaml", "").replace(".yml", "")
                     data["name"] = data["key"].title()
                
                if "key" not in data:
                    data["key"] = filename.replace(".yaml", "").replace(".yml", "")

                found_items.append(data)
                print(f"   📜 Found: {data.get('name', data['key'])}")

        except Exception as e:
            print(f"   ❌ Error reading {filename}: {e}")

    # 2. Upsert
    print(f"💾 Syncing {len(found_items)} items to '{table_name}'...")
    for item in found_items:
        try:
            # We assume 'key' is the unique constraint for all registries
            existing = supabase.table(table_name).select("id").eq("key", item["key"]).execute()
            
            if existing.data:
                supabase.table(table_name).update(item).eq("key", item["key"]).execute()
            else:
                supabase.table(table_name).insert(item).execute()
        except Exception as e:
            print(f"   ⚠️ API Error for {item['key']}: {e}")

    print(f"✅ Sync Complete for {table_name}.")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python3 sync_generic.py <directory> <table_name>")
        exit(1)
        
    directory = sys.argv[1]
    table = sys.argv[2]
    asyncio.run(sync_generic(directory, table))
