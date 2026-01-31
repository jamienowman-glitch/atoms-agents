import os
import sys
import yaml
from pathlib import Path
from supabase import create_client, Client

# --- Config ---
ROOT_DIR = Path("/Users/jaynowman/dev")
VAULT_DIR = Path("/Users/jaynowman/northstar-keys")

# --- Vault Logic ---
def get_secret(key_name: str) -> str:
    """Read secret from the local Vault directory."""
    secret_path = VAULT_DIR / key_name
    if not secret_path.exists():
        print(f"❌ Secret not found: {secret_path}")
        return None
    return secret_path.read_text().strip()

# --- Wildcard Map ---
# Tuple: (Repo, physical_path, base_alias, default_type, is_product_repo)
MAPPINGS = [
    ("atoms-ui", "canvases/multi21/_atoms", "@atoms", "atom", False),
    ("atoms-ui", "harnesses", "@harnesses", "harness", False),
    ("atoms-ui", "canvases", "@canvases", "page", False),
    ("atoms-site-templates", ".", "@templates", "template", False),
    ("atoms-connectors", "src/atoms_connectors", "atoms_connectors", "connector", True),
    ("atoms-muscle", "src/atoms_muscle", "atoms_muscle", "muscle", True),
    ("atoms-core", "src/atoms_core", "atoms_core", "atom", False),
    ("atoms-agents", "src/atoms_agents", "atoms_agents", "atom", False),
    ("atoms-tuning", "atoms_tuning", "atoms_tuning", "atom", False),
    ("atoms-app", "src/app/_flat_config", "@config", "config", False),
]

def connect_db():
    url = get_secret("supabase-url.txt")
    key = get_secret("supabase-service-key.txt")
    
    if not url or not key:
        print("❌ Could not load credentials from Vault.")
        sys.exit(1)
        
    return create_client(url, key)

def scan_directory(repo, root_path, base_alias, default_type, is_product_repo):
    full_path = ROOT_DIR / repo / root_path
    if not full_path.exists():
        print(f"⚠️  Path not found: {full_path}")
        return []

    results = []
    print(f"🔎 Scanning {repo}...")
    
    for current_root, dirs, files in os.walk(full_path):
        current_path = Path(current_root)
        try:
            rel_path = current_path.relative_to(ROOT_DIR / repo)
        except ValueError:
            continue
        
        # Identify Product Markers
        has_spec = "spec.yaml" in files or "manifest.yaml" in files
        has_skill = "SKILL.md" in files
        
        # Logic: If this is a product repo (muscle/connector), we only index folders with spec.yaml as Products.
        # Otherwise we scan per file.
        
        if is_product_repo:
            print(f"DEBUG: Checking {rel_path} (Has Spec: {has_spec})")
            if has_spec:
                 # Determine Alias
                try:
                    alias_suffix = str(rel_path.relative_to(root_path)).replace("/", ".").replace("\\", ".")
                    if "atoms_" in base_alias:
                         alias = f"{base_alias}.{alias_suffix}".strip(".")
                    else:
                         alias = f"{base_alias}/{str(rel_path.relative_to(root_path))}"
                except ValueError:
                    continue

                # Parse Spec
                spec_file = current_path / ("spec.yaml" if "spec.yaml" in files else "manifest.yaml")
                try:
                    with open(spec_file) as f:
                        spec = yaml.safe_load(f) or {}
                except Exception:
                    spec = {}
                
                # Product found!
                results.append({
                    "alias": alias,
                    "repo": repo.replace("atoms-", ""),
                    "file_path": str(rel_path),
                    "type": default_type, # 'muscle' or 'connector'
                    "has_connector": True, # Means "Has Spec"
                    "has_skill": has_skill,
                    "product_name": spec.get("name", alias),
                    "description": spec.get("description", "No description"),
                    "product_meta": spec
                })
        
        else:
            # File Scanning (Atoms, Configs)
            if default_type == "atom" and "_atoms" in str(full_path):
                 for file in files:
                    if file.endswith(".tsx") or file.endswith(".ts"):
                        file_name = file.rsplit(".", 1)[0]
                        alias = f"{base_alias}/{file_name}"
                        results.append({
                            "alias": alias,
                            "repo": repo.replace("atoms-", ""),
                            "file_path": str(rel_path / file),
                            "type": "atom",
                            "product_name": file_name,
                            "description": "UI Atom"
                        })
            
            elif default_type == "config":
                 for file in files:
                     if file == "page.tsx":
                         slug = current_path.name
                         alias = f"@god/config/{slug}"
                         results.append({
                             "alias": alias,
                             "repo": "app",
                             "file_path": str(rel_path / file),
                             "type": "config",
                             "product_name": slug,
                             "description": "Config Page"
                         })

    return results

def main():
    print("🕷️ Registry Spider Initialized (Product Aware).")
    db = connect_db()
    print("✅ Connected to Supabase via Vault.")
    
    all_components = []
    
    for repo, root, base_alias, c_type, is_prod in MAPPINGS:
        components = scan_directory(repo, root, base_alias, c_type, is_prod)
        all_components.extend(components)
        
    print(f"📦 Found {len(all_components)} components.")
    
    # Upsert Logic
    for comp in all_components:
        try:
            data = {
                "alias": comp["alias"],
                "repo": comp["repo"],
                "file_path": comp["file_path"],
                "type": comp["type"],
                "has_skill": comp.get("has_skill", False),
                "has_connector": comp.get("has_connector", False),
                "product_name": comp.get("product_name"),
                "description": comp.get("description"),
                "product_meta": comp.get("product_meta", {}),
                "status": "active"
            }
            db.table("registry_components").upsert(data, on_conflict="alias").execute()
            print(f"  -> Indexed ({comp['type']}): {comp['alias']}")
            
        except Exception as e:
            print(f"❌ Error indexing {comp['alias']}: {e}")

    print("✅ Spider Run Complete.")

if __name__ == "__main__":
    main()
