import os
import asyncio
from supabase import create_client, Client

VAULT_PATH = "/Users/jaynowman/northstar-keys/"

def read_vault(filename):
    try:
        with open(os.path.join(VAULT_PATH, filename), "r") as f:
            return f.read().strip()
    except FileNotFoundError:
        print(f"❌ FATAL: Missing Key in Vault: {filename}")
        print(f"   PLEASE CREATE: {VAULT_PATH}{filename}")
        exit(1)

# Load Keys from Vault (Txt Format)
# User Convention: kebab-case.txt
SUPABASE_URL = read_vault("supabase-url.txt") 
SUPABASE_KEY = read_vault("supabase-service-key.txt") # Service Role for seeding

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# 1. SPACES (The Contexts)
SPACES = [
    {"key": "health", "name": "Health & Vitality", "description": "Training, Diet, Sleep"},
    {"key": "marketing", "name": "Marketing & Growth", "description": "Leads, Campaigns, Brand"},
    {"key": "quantum", "name": "Quantum & Logic", "description": "Computing, reasoning, logic"},
    {"key": "tuning", "name": "Tuning & Optimization", "description": "System performance, weighting"}
]

async def seed_spaces():
    print(f"🌌 Seeding {len(SPACES)} Spaces...")
    for space in SPACES:
        existing = supabase.table("spaces").select("id").eq("key", space["key"]).execute()
        if existing.data:
            print(f"   🔹 Updating Space: {space['name']}...")
            supabase.table("spaces").update(space).eq("key", space["key"]).execute()
        else:
            print(f"   ✨ Creating Space: {space['name']}...")
            supabase.table("spaces").insert(space).execute()
        
    # Purge others? For now, we just ensure these exist.

# 2. SURFACES (The Flow Containers)
SURFACES = [
    {
        "key": "agnx", 
        "name": "AGNˣ", 
        "space_key": "marketing",
        "description": "Agentic Marketing & Campaign Orchestration.",
        "config": {"blurb": "Your autonomous marketing department.", "features": ["Campaign Manager"]}
    },
    {
        "key": "mc2", 
        "name": "=MC²", 
        "space_key": "health",
        "description": "Health, Biometrics & Energy Optimization.",
        "config": {"blurb": "Energy = Mass * Consciousness Squared.", "features": ["Sleep Tracking"]}
    },
    {
        "key": "p2", 
        "name": "P²", 
        "space_key": "quantum", # Closest map to Productivity/Logic?
        "description": "Performance & Productivity.",
        "config": {"blurb": "Peak Performance System.", "features": ["Goal Setting"]}
    },
    {
        "key": "x3", 
        "name": "X³", 
        "space_key": "quantum",
        "description": "Spatial Computing & 3D Experiential.",
        "config": {"blurb": "The Third Dimension of Experience.", "features": ["3D Canvas"]}
    },
    {
        "key": "vous2", 
        "name": "VO(U)S²", 
        "space_key": "tuning", # Closest map?
        "description": "Voice of User / Voice of System.",
        "config": {"blurb": "Bridging Human Intent and System Action.", "features": ["Voice Cloning"]}
    },
    {
        "key": "bot_better_know", 
        "name": "BOT BETTER KNOW", 
        "space_key": "quantum",
        "description": "Knowledge Graph & educational agents.",
        "config": {"blurb": "Agents that know better.", "features": ["RAG"]}
    },
    {
        "key": "many_worlds", 
        "name": "MANYΨorlds", 
        "space_key": "quantum", 
        "description": "Simulation & Scenario Planning.",
        "config": {"blurb": "Explore infinite possibilities.", "features": ["Monte Carlo"]}
    }
]

# 3. DOMAINS (The URLs)
DOMAINS = [
    {"url": "marketing.atoms.fam", "surface_key": "agnx"},
    {"url": "body.atoms.fam", "surface_key": "mc2"},
    {"url": "work.atoms.fam", "surface_key": "p2"},
    {"url": "3d.atoms.fam", "surface_key": "x3"},
    {"url": "voice.atoms.fam", "surface_key": "vous2"},
    {"url": "learn.atoms.fam", "surface_key": "bot_better_know"},
    {"url": "sim.atoms.fam", "surface_key": "many_worlds"},
    {"url": "console.atoms.fam", "surface_key": "agnx"} # Temporary: Console mapping
]

async def seed_surfaces():
    print(f"🌱 Seeding {len(SURFACES)} Surfaces...")
    for surface in SURFACES:
        payload = surface.copy()
        existing = supabase.table("surfaces").select("id").eq("key", surface["key"]).execute()
        if existing.data:
            print(f"   🔹 Updating {surface['name']} ({surface['key']})...")
            supabase.table("surfaces").update(payload).eq("key", surface["key"]).execute()
        else:
            print(f"   ✨ Creating {surface['name']} ({surface['key']})...")
            supabase.table("surfaces").insert(payload).execute()

async def seed_domains():
    print(f"🌐 Seeding {len(DOMAINS)} Domains...")
    for domain in DOMAINS:
         # Upsert on URL
        supabase.table("domains").upsert(domain, on_conflict="url").execute()

# 4. CANVASES LIST
CANVASES = [
    {
        "key": "multi21",
        "name": "Multi21",
        "description": "The Universal Marketing Canvas.",
        "config": {
             "type": "infinite",
             "tools": ["text", "image", "video", "browser"],
             "background": "#f0f0f0"
        }
    }
]

async def seed_canvases():
    print(f"🎨 Seeding {len(CANVASES)} Canvases...")
    for canvas in CANVASES:
        # Check if exists
        existing = supabase.table("canvases").select("id").eq("key", canvas["key"]).execute()
        
        if existing.data:
            print(f"   🔹 Updating {canvas['name']} ({canvas['key']})...")
            supabase.table("canvases").update({
                "name": canvas["name"],
                "description": canvas["description"],
                "config": canvas["config"]
            }).eq("key", canvas["key"]).execute()
        else:
            print(f"   ✨ Creating {canvas['name']} ({canvas['key']})...")
            supabase.table("canvases").insert(canvas).execute()


async def main():
    await seed_spaces()
    await seed_surfaces()
    await seed_domains()
    await seed_canvases()

if __name__ == "__main__":
    asyncio.run(main())
