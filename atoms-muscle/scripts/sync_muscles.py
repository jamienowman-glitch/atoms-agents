import os
import json
import re
import logging
from pathlib import Path
from typing import List, Dict, Optional
import sys
import os

# Ensure atoms-core is findable (Bootstrap Problem)
# We trust that if we are running standard scripts, we are in a layout where atoms-core is a peer.
# Or we hardcode the bootstrap path just once to load the Aliaser.
bootstrap_core = Path(os.path.expanduser("~/dev/atoms-core/src"))
if bootstrap_core.exists():
    sys.path.append(str(bootstrap_core))

try:
    from atoms_core.config.naming import get_secret_name
    from atoms_core.config.aliases import resolve_path, ATOMS_CORE
except ImportError:
    print(f"CRITICAL: Could not bootstrap atoms-core from {bootstrap_core}.")
    exit(1)

# Try to import supabase
try:
    from supabase import create_client, Client
except ImportError:
    print("Supabase client library not found. Install with `pip install supabase`")
    exit(1)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("sync_muscles")

# VAULT LOADER
VAULT_PATH = Path(os.path.expanduser("~/northstar-keys"))
def load_vault_secret(filename: str) -> Optional[str]:
    try:
        with open(VAULT_PATH / filename, 'r') as f:
            return f.read().strip()
    except FileNotFoundError:
        return None

# CONFIG LOADING (Vault Strict -> Vault Legacy -> Env Fallback)
sup_url_name = get_secret_name('DEFAULT', 'SUPABASE', 'URL') # DEFAULT_SUPABASE_URL
sup_key_name = get_secret_name('DEFAULT', 'SUPABASE', 'SERVICE_ROLE_KEY') # DEFAULT_SUPABASE_SERVICE_ROLE_KEY

SUPABASE_URL = load_vault_secret(f"{sup_url_name}.txt") or load_vault_secret("supabase-url.txt") or os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = load_vault_secret(f"{sup_key_name}.txt") or load_vault_secret("supabase-service-key.txt") or os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    logger.error("Missing Supabase credentials. Checked Vault (Strict & Legacy) and Env.")
    exit(1)

def parse_skill_md(path: Path) -> Dict[str, str]:
    """
    Parses the YAML frontmatter from SKILL.md
    """
    with open(path, 'r') as f:
        content = f.read()
    
    # Simple regex to get frontmatter
    match = re.search(r'^---\n(.*?)\n---', content, re.DOTALL)
    if not match:
        return {}
    
    yaml_block = match.group(1)
    data = {}
    for line in yaml_block.split('\n'):
        if ':' in line:
            key, val = line.split(':', 1)
            data[key.strip()] = val.strip()
            
    return data

def scan_muscles(src_root: Path) -> List[Dict]:
    muscles = []
    # Walk src directory
    # Structure: src/{category}/{name}/SKILL.md
    
    # We allow arbitrary depth but typically it's category/name
    for root, dirs, files in os.walk(src_root):
        if 'SKILL.md' in files:
            skill_path = Path(root) / 'SKILL.md'
            try:
                meta = parse_skill_md(skill_path)
                if not meta.get('name'):
                    logger.warning(f"Skipping {skill_path}: Missing 'name' in frontmatter")
                    continue
                    
                # Infer directory structure info
                rel_path = Path(root).relative_to(src_root)
                parts = rel_path.parts
                
                # Default category from folder if not in frontmatter
                category = meta.get('category')
                if not category and len(parts) > 0:
                    category = parts[0]
                
                # Construct key: category.name
                key = f"{category}.{meta['name']}"
                
                muscle = {
                    "key": key,
                    "name": meta['name'], # Internal name? Or Display Name?
                    "category": category,
                    "description": meta.get('description', ''),
                    "pitch_headline": meta.get('pitch_headline', ''),
                    "pitch": meta.get('pitch', ''),
                    "aeo_keywords": meta.get('aeo_keywords', []),
                    "author_identity": meta.get('author_identity', 'Atoms Orchestrator'),
                    # Check for other files to determine status
                    "has_mcp": (Path(root) / 'mcp.py').exists(),
                    "has_service": (Path(root) / 'service.py').exists()
                }
                
                # Determine Status based on files
                if muscle['has_mcp'] and muscle['has_service']:
                    muscle['status'] = 'prod' 
                else:
                    muscle['status'] = 'dev'
                    
                muscles.append(muscle)
                
            except Exception as e:
                logger.error(f"Error parsing {skill_path}: {e}")
                
    return muscles

def sync_registry(muscles: List[Dict]):
    client: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    logger.info(f"Found {len(muscles)} muscles on disk.")
    
    for m in muscles:
        record = {
            "key": m['key'],
            "name": m['name'],
            "category": m['category'],
            "description": m['description'],
            "status": m['status'],
            "spec": m.get('spec', {}) # Fix NULL Spec Violation
        }
        
        try:
            # Upsert
            # Constraint is UNIQUE(key, tenant_id). We target that.
            data = client.table("muscles").upsert(record, on_conflict="key,tenant_id").execute()
            logger.info(f"Synced: {m['key']} (Status: {m['status']})")
        except Exception as e:
            logger.error(f"Failed to sync {m['key']}: {e}")

def generate_discovery_manifests(muscles: List[Dict], output_dir: Path):
    """
    Generates /.well-known/agents.json and /.well-known/mcp.json
    """
    well_known_dir = output_dir / ".well-known"
    well_known_dir.mkdir(parents=True, exist_ok=True)
    
    prod_muscles = [m for m in muscles if m['status'] == 'prod']
    logger.info(f"Generating discovery manifests for {len(prod_muscles)} PROD muscles...")
    
    # 1. agents.json (The Catalog)
    agents_catalog = {
        "version": "1.0.0",
        "publisher": {
            "name": "Atoms-Fam Factory",
            "url": "https://atoms.fam",
            "author_identity": "Atoms Orchestrator"
        },
        "agents": []
    }
    
    for m in prod_muscles:
        agent_entry = {
            "id": m['key'],
            "name": m['name'].replace("_", " ").title(),
            "description": m['description'],
            "pitch_headline": m.get('pitch_headline') or f"Professional {m['name']} capability.",
            "category": m['category'],
            "pricing": {
                "model": "snax_metered",
                "rate": 10,
                "unit": "minute"
            },
            "capabilities": m.get('aeo_keywords') or [f"{m['category']} processing"],
            "endpoints": {
                "mcp": f"sse://atoms.fam/mcp/{m['key']}"
            },
            "status": "prod"
        }
        agents_catalog['agents'].append(agent_entry)
        
    with open(well_known_dir / "agents.json", "w") as f:
        json.dump(agents_catalog, f, indent=2)
    logger.info(f"✅ Generated {well_known_dir}/agents.json")
    
    # 2. mcp.json (The Connection)
    mcp_index = {
        "mcpServers": {}
    }
    
    for m in prod_muscles:
        mcp_index['mcpServers'][m['key']] = {
            "url": f"sse://atoms.fam/mcp/{m['key']}",
            "requires_auth": True
        }
        
    with open(well_known_dir / "mcp.json", "w") as f:
        json.dump(mcp_index, f, indent=2)
    logger.info(f"✅ Generated {well_known_dir}/mcp.json")

if __name__ == "__main__":
    # Use the Aliased Path if possible to ensure we are scanning the canonical repo
    target_root = ATOMS_MUSCLE if 'ATOMS_MUSCLE' in locals() else Path(__file__).parent.parent
    src_dir = target_root / "src"

    if not src_dir.exists():
        logger.error(f"Source directory not found: {src_dir}")
        exit(1)
        
    logger.info(f"Scanning Muscles in: {src_dir} (via {'Alias' if 'ATOMS_MUSCLE' in locals() else 'Relative Path'})")
    found_muscles = scan_muscles(src_dir)
    sync_registry(found_muscles)
    
    # Phase 9: autonomous discoverability
    # Generate manifests in atoms-muscle root (parent of src)
    generate_discovery_manifests(found_muscles, src_dir.parent)
