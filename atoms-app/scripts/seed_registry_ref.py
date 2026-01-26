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

# 1. THE DEFINITIVE SURFACE LIST
# Key: Slug (for URL/DB), Name: Display (Exotic), Description: Summary
SURFACES = [
    {
        "key": "agnx", 
        "name": "AGNˣ", 
        "description": "Agentic Marketing & Campaign Orchestration.",
        "config": {
            "blurb": "Your autonomous marketing department.",
            "features": ["Campaign Manager", "Social Agents", "Analytics"]
        }
    },
    {
        "key": "mc2", 
        "name": "=MC²", 
        "description": "Health, Biometrics & Energy Optimization.",
        "config": {
            "blurb": "Energy = Mass * Consciousness Squared.",
            "features": ["Sleep Tracking", "Workout Plans", "Diet Agents"]
        }
    },
    {
        "key": "p2", 
        "name": "P²", 
        "description": "Performance & Productivity.",
        "config": {
            "blurb": "Peak Performance System.",
            "features": ["Goal Setting", "Focus Tools", "Deep Work"]
        }
    },
    {
        "key": "x3", 
        "name": "X³", 
        "description": "Spatial Computing & 3D Experiential.",
        "config": {
            "blurb": "The Third Dimension of Experience.",
            "features": ["3D Canvas", "VR Staging", "Asset Library"]
        }
    },
    {
        "key": "vous2", 
        "name": "VO(U)S²", 
        "description": "Voice of User / Voice of System.",
        "config": {
            "blurb": "Bridging Human Intent and System Action.",
            "features": ["Speech-to-Text", "Voice Cloning", "Podcast Gen"]
        }
    },
    {
        "key": "bot_better_know", 
        "name": "BOT BETTER KNOW", 
        "description": "Knowledge Graph & educational agents.",
        "config": {
            "blurb": "Agents that know better.",
            "features": ["RAG", "Quiz Gen", "Learning Paths"]
        }
    },
    {
        "key": "many_worlds", 
        "name": "MANYΨorlds", 
        "description": "Simulation & Scenario Planning.",
        "config": {
            "blurb": "Explore infinite possibilities.",
            "features": ["Monte Carlo", "Market Sim", "War Gaming"]
        }
    }
]

async def seed_surfaces():
    print(f"🌱 Seeding {len(SURFACES)} Surfaces...")
    for surface in SURFACES:
        # Check if exists
        existing = supabase.table("surfaces").select("id").eq("key", surface["key"]).execute()
        
        if existing.data:
            print(f"   🔹 Updating {surface['name']} ({surface['key']})...")
            supabase.table("surfaces").update({
                "name": surface["name"],
                "description": surface["description"],
                "config": surface["config"]
            }).eq("key", surface["key"]).execute()
        else:
            print(f"   ✨ Creating {surface['name']} ({surface['key']})...")
            supabase.table("surfaces").insert(surface).execute()
    print("✅ Surfaces Seeded.")

if __name__ == "__main__":
    asyncio.run(seed_surfaces())
