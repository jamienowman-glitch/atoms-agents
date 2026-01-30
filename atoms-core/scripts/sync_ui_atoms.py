import os
import re
import json
import glob
import asyncio
import subprocess
from typing import Dict, Any, List
from supabase import create_client, Client

# --- SETUP & CONFIG ---

# 1. Vault Auth
VAULT_PATH = "/Users/jaynowman/northstar-keys/"

def read_vault(filename):
    try:
        with open(os.path.join(VAULT_PATH, filename), "r") as f:
            return f.read().strip()
    except FileNotFoundError:
        print(f"❌ Critical: Could not find vault key {filename}")
        exit(1)

SUPABASE_URL = read_vault("supabase-url.txt")
SUPABASE_KEY = read_vault("supabase-service-key.txt")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# 2. Paths
ATOMS_UI_PATH = "/Users/jaynowman/dev/atoms-ui/ui-atoms"

# --- HELPER: NODE JS PARSER ---

def node_eval_to_json(ts_content: str, config_name: str) -> Dict[str, Any]:
    """
    Strips TS types and uses Node.js to evaluate the object into JSON.
    Robust against '16:9', comments, and trailing commas.
    """
    # 1. Strip Interfaces and Imports
    # Remove import lines
    js_content = re.sub(r'^import .*$', '', ts_content, flags=re.MULTILINE)
    # Remove interface blocks (simple heuristic: interface ... { ... })
    # This is hard with regex nesting.
    # Logic: Simply look for the export const block and only extract that.
    
    match = re.search(r'export const (\w+)\s*:\s*AtomConfig\s*=\s*({[\s\S]*?});', ts_content)
    if not match:
         # Try without type annotation
         match = re.search(r'export const (\w+)\s*=\s*({[\s\S]*?});', ts_content)
    
    if not match:
        raise ValueError("Could not find config object pattern")
        
    obj_name = match.group(1)
    obj_body = match.group(2)
    
    # 2. Create Temp JS File
    # We assign it to a variable and log it.
    temp_script = f"""
    const {obj_name} = {obj_body}
    console.log(JSON.stringify({obj_name}));
    """
    
    # 3. Write and Run
    temp_path = "/tmp/atom_parser_temp.js"
    with open(temp_path, "w") as f:
        f.write(temp_script)
        
    try:
        result = subprocess.run(["node", temp_path], capture_output=True, text=True, check=True)
        return json.loads(result.stdout)
    except subprocess.CalledProcessError as e:
        print(f"   ❌ Node Error: {e.stderr}")
        raise ValueError("Node.js failed to parse the config object")
    except json.JSONDecodeError:
        print(f"   ❌ JSON Error. Output: {result.stdout}")
        raise ValueError("Node.js output invalid JSON")

# --- SYNC LOGIC ---

async def sync_registry():
    print("🚀 Starting UI Atom Registry Sync (Node Engine)...")
    
    # 1. Find Configs
    pattern = os.path.join(ATOMS_UI_PATH, "**/*.config.ts")
    config_files = glob.glob(pattern, recursive=True)
    
    if not config_files:
        print("⚠️  No .config.ts files found!")
        return

    print(f"🔎 Found {len(config_files)} config files.")
    
    atoms_data = []

    # 2. Parse Files
    for file_path in config_files:
        try:
            with open(file_path, "r") as f:
                content = f.read()
            
            # Heuristic: Config name usually Matches filename MultiTile -> MultiTileConfig
            # But regex handles extraction dynamic
            data = node_eval_to_json(content, "Auto")
            print(f"   ✅ Parsed {data.get('id', 'unknown')}")
            
            # Prepare Supabase Payload
            atoms_data.append({
                "id": data["id"],
                "key": data["id"],     # Legacy/Schema requirement
                "name": data["name"],
                "category": data["category"],
                "version": data["version"],
                "family": data["family"], 
                "traits": data["traits"] # Pass raw dict/list, supabase-py converts to jsonb
            })

        except Exception as e:
            print(f"   ❌ Error parsing {os.path.basename(file_path)}: {e}")

    # 3. Upsert to DB
    if atoms_data:
        print(f"💾 Syncing {len(atoms_data)} atoms to Supabase...")
        for atom in atoms_data:
            try:
                # Upsert one by one for better error transparency
                # Note: 'family' needs to be passed as list. Postgres array handling in supabase-py usually works.
                result = supabase.table("ui_atoms").upsert(atom).execute()
                print(f"      ✨ Upserted {atom['id']}")
            except Exception as db_e:
                 # Check for Missing Table Error (42P01)
                 msg = str(db_e)
                 if "42P01" in msg or '"ui_atoms" does not exist' in msg:
                     print(f"      🚨 TABLE MISSING! Please run 'atoms-core/sql/025_ui_atoms_registry.sql'")
                     return
                 print(f"      💥 DB Error for {atom['id']}: {db_e}")

    print("🏁 Sync Complete.")

if __name__ == "__main__":
    asyncio.run(sync_registry())
