import os
from pathlib import Path
from supabase import create_client, Client

VAULT_PATH = "/Users/jaynowman/northstar-keys/"

def read_vault(filename: str) -> str:
    try:
        with open(os.path.join(VAULT_PATH, filename), "r") as f:
            return f.read().strip()
    except FileNotFoundError:
        print(f"❌ FATAL: Missing Key in Vault: {filename}")
        print(f"   PLEASE CREATE: {VAULT_PATH}{filename}")
        raise SystemExit(1)

SUPABASE_URL = read_vault("supabase-url.txt")
SUPABASE_KEY = read_vault("supabase-service-key.txt")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

CONNECTORS_ROOT = Path("/Users/jaynowman/dev/atoms-connectors/src")
EXCLUDE_DIRS = {"_template", "common"}

def to_display_name(slug: str) -> str:
    parts = slug.replace("-", "_").split("_")
    return " ".join(p.capitalize() for p in parts if p)

def list_connectors() -> list[dict]:
    providers = []
    for entry in sorted(CONNECTORS_ROOT.iterdir()):
        if not entry.is_dir():
            continue
        if entry.name in EXCLUDE_DIRS:
            continue
        slug = entry.name
        providers.append(
            {
                "provider_id": slug,
                "platform_slug": slug,
                "display_name": to_display_name(slug),
                "naming_rule": "PROVIDER_{PLATFORM}_KEY",
            }
        )
    return providers

def sync_providers():
    providers = list_connectors()
    print(f"🔌 Found {len(providers)} connector folders.")
    for provider in providers:
        existing = (
            supabase.table("connector_providers")
            .select("provider_id")
            .eq("provider_id", provider["provider_id"])
            .execute()
        )
        if existing.data:
            print(f"   🔹 Updating: {provider['platform_slug']}")
            supabase.table("connector_providers").update(provider).eq(
                "provider_id", provider["provider_id"]
            ).execute()
        else:
            print(f"   ✨ Inserting: {provider['platform_slug']}")
            supabase.table("connector_providers").insert(provider).execute()

if __name__ == "__main__":
    sync_providers()
