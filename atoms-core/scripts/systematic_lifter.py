# THE SYSTEMATIC LIFTER
# Plan: 2026-02-01_global_lift_implementation_plan.md

import os
import re
from pathlib import Path
from supabase import create_client, Client

ROOT = Path("/Users/jaynowman/dev")
EXTENSIONS = {".ts", ".tsx", ".py"}
VAULT_PATH = Path("/Users/jaynowman/northstar-keys/")

# ALIAS MAPPING
ALIAS_MAP = {
    # UI / TS Aliases
    "atoms-ui/canvases/multi21/_atoms": "@atoms",
    "atoms-ui/harnesses": "@harnesses",
    "atoms-ui/harnesses/_shared": "@harnesses-shared",
    "atoms-ui/canvases": "@canvases",
    "atoms-ui/canvases/_shared": "@canvases-shared",
    "atoms-ui/types": "@ui-types",
    "atoms-site-templates": "@templates",
    "atoms-ui/harnesses/Mother/logic": "@logic",
    "atoms-ui/harnesses/Mother/tool-areas": "@tool-areas",
    "atoms-app/src/components": "@components",
    "atoms-app/src/hooks": "@hooks",
    "atoms-app/src/lib": "@lib",
    "atoms-app/src": "@",
    "atoms-app/src/app/god": "@god",
    "packages": "@packages",
    
    # Python Namespaces
    "atoms-core/src/atoms_core": "atoms_core",
    "atoms-muscle/src/atoms_muscle": "atoms_muscle",
    "atoms-agents/src/atoms_agents": "atoms_agents",
    "atoms-connectors/src/atoms_connectors": "atoms_connectors"
}

def get_vault_key(name):
    with open(VAULT_PATH / f"{name}.txt", "r") as f:
        return f.read().strip()

def get_identity(physical_path: Path) -> str:
    try:
        abs_path = str(physical_path.resolve())
    except:
        return str(physical_path)
    sorted_bases = sorted(ALIAS_MAP.keys(), key=lambda k: len(k), reverse=True)
    for base in sorted_bases:
        base_abs = str((ROOT / base).resolve())
        if abs_path.startswith(base_abs):
            alias = ALIAS_MAP[base]
            rel_path = physical_path.relative_to(ROOT / base)
            stem = str(rel_path.with_suffix('')).replace('\\', '/')
            if alias == "@" and stem == "": return "@"
            if alias in ["atoms_core", "atoms_muscle", "atoms_agents", "atoms_connectors"]:
                return f"{alias}.{stem.replace('/', '.')}"
            return f"{alias}/{stem}".replace("//", "/")
    return str(physical_path)

def resolve_import_to_alias(current_file: Path, import_path: str, ext: str) -> str:
    try:
        if ext == ".py": return import_path
        target_abs = (current_file.parent / import_path).resolve()
        if not target_abs.exists():
            for e in [".ts", ".tsx", ".d.ts", ".js", ".jsx"]:
                if Path(str(target_abs) + e).exists():
                    target_abs = Path(str(target_abs) + e)
                    break
        identity = get_identity(target_abs)
        if identity.startswith(("@", "atoms_")): return identity
    except: pass
    return import_path

def systematic_lift(dry_run=True, max_files=None, persist=False):
    print(f"🚀 Starting Systematic Lift (Files: ~3000, Dry Run: {dry_run}, Persist: {persist})")
    
    supabase = None
    if persist:
        SUPABASE_URL = get_vault_key("supabase-url")
        SUPABASE_KEY = get_vault_key("supabase-service-key")
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

    scanned = 0
    refactored_files = 0
    registry_batch = []
    registered = 0
    
    for ext in EXTENSIONS:
        files = list(ROOT.rglob(f"*{ext}"))
        for p in files:
            if any(x in str(p) for x in ["node_modules", ".venv", "__pycache__", ".next", ".git"]):
                continue
            
            scanned += 1
            if max_files and scanned > max_files: break
            
            identity = get_identity(p)
            
            # Step 1: Register in Phonebook (Batching)
            if persist and supabase:
                try:
                    repo_parts = str(p.relative_to(ROOT)).split('/')
                    original_repo = repo_parts[0] if repo_parts else "unknown"
                    
                    # Normalize for DB Enum
                    repo_enum = original_repo.replace("atoms-", "")
                    if repo_enum in ["_scripts", "scripts", "tools"]:
                        repo_enum = "system"
                    elif repo_enum not in ["ui", "app", "core", "muscle", "connectors", "agents", "tuning", "templates", "safety", "packages", "system"]:
                        repo_enum = "core" # Fallback
                        
                    registry_batch.append({
                        "alias": identity,
                        "file_path": str(p.relative_to(ROOT)),
                        "repo": repo_enum,
                        "type": "atom"
                    })
                    
                    if len(registry_batch) >= 100:
                        supabase.table("registry_components").upsert(registry_batch, on_conflict="alias").execute()
                        registered += len(registry_batch)
                        registry_batch = []
                        print(f"   Registered {registered} entities...")
                except Exception as e:
                    print(f"❌ Batch registration failed: {e}")

            # Step 2: Refactor (TS/TSX)
            with open(p, 'r', errors='ignore') as f:
                content = f.read()
            
            new_content = content
            ts_matches = re.findall(r'from\s+[\'"](\.\.?\/.*?)[\'"]|import\s+[\'"](\.\.?\/.*?)[\'"]', content)
            for m in ts_matches:
                rel_path = m[0] or m[1]
                alias = resolve_import_to_alias(p, rel_path, ext)
                if alias != rel_path:
                    escaped_rel = rel_path.replace('.', '\\.')
                    new_content = re.sub(f'[\'"]{escaped_rel}[\'"]', f"'{alias}'", new_content)
            
            # Identify Python Brittle
            if ext == ".py":
                py_matches = re.finditer(r'from\s+(\.\.+[a-zA-Z0-9_\.]+)\s+import', content)
                for m in py_matches:
                    rel_dots = m.group(1)
                    # Resolve Python relative dots to absolute namespace
                    # e.g., from ..identity.models -> from atoms_core.identity.models
                    dots_count = len(re.match(r'^\.+', rel_dots).group(0))
                    remainder = rel_dots[dots_count:]
                    
                    # Calculate target path
                    target_dir = p.parent
                    for _ in range(dots_count - 1):
                        target_dir = target_dir.parent
                        
                    # Target physical path
                    target_physical = (target_dir / remainder.replace('.', '/'))
                    identity = get_identity(target_physical)
                    
                    if identity.startswith("atoms_"):
                        new_content = new_content.replace(f"from {rel_dots} import", f"from {identity} import")
                        refactored_files += 1

            if new_content != content:
                results.append({
                    "file": str(p.relative_to(ROOT)),
                    "identity": identity,
                    "imports": ts_matches # Simplified for report
                })
                if ext in [".ts", ".tsx"]:
                    refactored_files += 1
                if not dry_run:
                    with open(p, 'w') as f:
                        f.write(new_content)

        if max_files and scanned > max_files: break

    # Final batch
    if persist and supabase and registry_batch:
        supabase.table("registry_components").upsert(registry_batch, on_conflict="alias").execute()
        registered += len(registry_batch)

    print(f"\n📊 SUMMARY")
    print(f"Files Scanned: {scanned}")
    print(f"Entities Registered: {registered}")
    print(f"Total Needing Lift: {len(results) if 'results' in locals() else refactored_files}")
    
    # Debug: Print the first 10 refactored files
    if 'results' in locals() and results:
        for r in results[:10]:
            print(f"📄 {r['file']} ({r['identity']}) -> {r['imports']}")

if __name__ == "__main__":
    # EXECUTION MODE: The Global Lift
    # 1. Register all (already done, but keeping for idempotency)
    # 2. Refactor all 184 identified files
    systematic_lift(dry_run=False, max_files=None, persist=True)
