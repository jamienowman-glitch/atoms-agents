import os
import json
import logging
from typing import List, Dict

# Try to import supabase, or mock/fail gently
try:
    from supabase import create_client, Client
except ImportError:
    print("Supabase client library not found. Install with `pip install supabase`")
    exit(1)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("sync_muscles")

# CONFIG (Defaults for local dev if envs missing)
SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL", "http://127.0.0.1:54321")
SUPABASE_KEY = os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "") # Often needing service_role for writes

# If we are in the agent environment, we might not have the service role key readily available.
# However, typically the ANon key can write if RLS allows, or we need the service role.
# For now, let's assume we can try with the ANON key or prompt the user if it fails.
# Realistically, the "God Mode" implies we might need a service role key.
# But let's try with what we might have or standard placeholder.

if not SUPABASE_KEY:
    # Try to read from a local .env file or just warn
    print("WARNING: SUPABASE_KEY not set. Sync might fail.")

def load_inventory(path: str) -> List[Dict]:
    with open(path, 'r') as f:
        return json.load(f)

def sync_to_supabase(muscles: List[Dict]):
    client: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    # Transform to fit DB schema if needed. 
    # Current page.tsx expects: key, name, spec: { mcp_endpoint, pricing }
    # Our inventory has: category, name, description, mcp_url, middle_line
    
    records = []
    for m in muscles:
        # Construct a stable key: e.g. "video_multicam"
        key = m['name'].lower().replace(' ', '_')
        
        record = {
            "key": key,
            "name": m['name'],
            "spec": {
                "mcp_endpoint": m['mcp_url'],
                "pricing": "FREE", # Default pending actual logic
                "description": m['description'],
                "category": m['category']
            }
        }
        records.append(record)
        
    logger.info(f"Syncing {len(records)} muscles to Supabase...")
    
    for rec in records:
        try:
            # Upsert by key
            res = client.table("muscles").upsert(rec, on_conflict="key").execute()
            logger.info(f"Synced: {rec['key']}")
        except Exception as e:
            logger.error(f"Failed to sync {rec['key']}: {e}")

if __name__ == "__main__":
    INVENTORY_PATH = "/Users/jaynowman/.gemini/antigravity/brain/25d74e8d-0916-4d1b-8b34-c550ef13c252/muscle_inventory.json"
    
    if not os.path.exists(INVENTORY_PATH):
        logger.error(f"Inventory not found at {INVENTORY_PATH}")
        exit(1)
        
    data = load_inventory(INVENTORY_PATH)
    sync_to_supabase(data)
