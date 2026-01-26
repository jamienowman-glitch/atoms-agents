import os
import asyncio
import yaml # Requires PyYAML
from supabase import create_client, Client

# Vault Config
VAULT_PATH = "/Users/jaynowman/northstar-keys/"
def read_vault(filename):
    try:
        with open(os.path.join(VAULT_PATH, filename), "r") as f:
            return f.read().strip()
    except FileNotFoundError:
        print(f"❌ FATAL: Missing Key in Vault: {filename}")
        exit(1)

SUPABASE_URL = read_vault("supabase-url.txt")
SUPABASE_KEY = read_vault("supabase-service-key.txt")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

MUSCLE_ROOT = "/Users/jaynowman/dev/atoms-muscle/src/muscle"

async def sync_muscles():
    print(f"🏋️ Scanning Muscles at {MUSCLE_ROOT}...")
    
    # 1. Walk Directories
    found_muscles = []
    
    # Iterate Categories (audio, video, vision, etc.)
    
    def scan_dir(base_path, category_prefix):
        found = []
        if not os.path.exists(base_path): return found
        
        for item_name in os.listdir(base_path):
            item_path = os.path.join(base_path, item_name)
            if not os.path.isdir(item_path) or item_name.startswith("__") or item_name == "legacy":
                continue

            # Check if this IS a muscle (has service.py or is a folder in a category)
            # In atoms-muscle/src/muscle: 
            #   Category -> Muscle -> service.py
            #   So verify if item_path is a Category
            
            # If we are scanning "src/muscle", item IS a category.
            if category_prefix == "":
                 category = item_name
                 for muscle_name in os.listdir(item_path):
                     muscle_path = os.path.join(item_path, muscle_name)
                     if os.path.isdir(muscle_path) and not muscle_name.startswith("__"):
                         found.append(process_muscle(muscle_path, category, muscle_name))
            
            # If we are scanning "legacy/muscle", item IS a muscle.
            elif category_prefix == "legacy":
                 found.append(process_muscle(item_path, "legacy", item_name))
        return found

    def process_muscle(path, category, name):
        key = f"muscle_{category}_{name}"
        data = {
            "key": key,
            "name": f"{category.title()} {name.title()}",
            "description": "Auto-detected muscle.",
            "spec": {},
            "status": "ready"
        }
        
        skill_path = os.path.join(path, "SKILL.md")
        if os.path.exists(skill_path):
            try:
                with open(skill_path, "r") as f:
                    content = f.read()
                    if content.startswith("---"):
                        end = content.find("---", 3)
                        if end != -1:
                            meta = yaml.safe_load(content[3:end])
                            if "metadata" in meta:
                                if "short-description" in meta["metadata"]:
                                    data["description"] = meta["metadata"]["short-description"]
                                if "mcp-endpoint" in meta["metadata"]:
                                    data["spec"]["mcp_endpoint"] = meta["metadata"]["mcp-endpoint"]
            except: pass
        else:
             print(f"   ⚠️ No SKILL.md for {key}")
        return data

    # 1. Scan Standard Categories
    found_muscles.extend(scan_dir(MUSCLE_ROOT, ""))
    
    # 2. Scan Legacy
    found_muscles.extend(scan_dir(os.path.join(MUSCLE_ROOT, "legacy/muscle"), "legacy"))

    # 3. Upsert to DB
    print(f"💪 Syncing {len(found_muscles)} Muscles to Registry...")
    for muscle in found_muscles:
        # Check Exists
        existing = supabase.table("muscles").select("id").eq("key", muscle["key"]).execute()
        
        if existing.data:
            print(f"   🔹 Updating {muscle['key']}...")
            supabase.table("muscles").update({
                "name": muscle["name"],
                "description": muscle["description"],
                "spec": muscle["spec"]
            }).eq("key", muscle["key"]).execute()
        else:
            print(f"   ✨ Creating {muscle['key']}...")
            supabase.table("muscles").insert(muscle).execute()

    print("✅ Muscle Sync Complete.")

if __name__ == "__main__":
    asyncio.run(sync_muscles())
