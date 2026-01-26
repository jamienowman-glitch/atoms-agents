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
    for category in os.listdir(MUSCLE_ROOT):
        cat_path = os.path.join(MUSCLE_ROOT, category)
        if not os.path.isdir(cat_path) or category.startswith("__") or category == "legacy":
            continue
            
        # Iterate Muscles (transcriber, extractor etc.)
        for muscle_name in os.listdir(cat_path):
            muscle_path = os.path.join(cat_path, muscle_name)
            if not os.path.isdir(muscle_path) or muscle_name.startswith("__"):
                continue

            # 2. Check for SKILL.md
            skill_path = os.path.join(muscle_path, "SKILL.md")
            key = f"muscle_{category}_{muscle_name}"
            
            muscle_data = {
                "key": key,
                "name": f"{category.title()} {muscle_name.title()}",
                "description": "Auto-detected muscle.",
                "spec": {},
                "status": "ready" # Assume ready if code exists
            }

            if os.path.exists(skill_path):
                print(f"   📜 Found SKILL.md for {key}")
                try:
                    with open(skill_path, "r") as f:
                        # Simple frontmatter parser (reliable enough for this)
                        content = f.read()
                        if content.startswith("---"):
                            end_metrics = content.find("---", 3)
                            if end_metrics != -1:
                                yaml_text = content[3:end_metrics]
                                meta = yaml.safe_load(yaml_text)
                                
                                # Map Metadata
                                if "metadata" in meta:
                                    if "short-description" in meta["metadata"]:
                                        muscle_data["description"] = meta["metadata"]["short-description"]
                                    if "mcp-endpoint" in meta["metadata"]:
                                        muscle_data["spec"]["mcp_endpoint"] = meta["metadata"]["mcp-endpoint"]
                except Exception as e:
                    print(f"   ⚠️ Error reading SKILL.md for {key}: {e}")
            else:
                 print(f"   ⚠️ No SKILL.md for {key}. Using defaults.")

            found_muscles.append(muscle_data)

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
