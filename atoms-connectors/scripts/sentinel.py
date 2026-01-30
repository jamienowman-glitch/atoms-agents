import sys
import os
from pathlib import Path
import logging

# Ensure atoms-core is in python path
# Assuming the script is run from repo root or atoms-connectors root.
# If run from atoms-connectors root, atoms-core is ../atoms-core
current_dir = Path(__file__).parent.resolve()
# current_dir is atoms-connectors/scripts
# repo_root is atoms-connectors/.. -> root
repo_root = current_dir.parent.parent
atoms_core_path = repo_root / "atoms-core"

if str(atoms_core_path) not in sys.path:
    sys.path.append(str(atoms_core_path))

try:
    from atoms_core.src.config import get_settings
except ImportError:
    # Try importing without atoms_core prefix if it's the root package style (unlikely but safe)
    try:
        sys.path.append(str(atoms_core_path / "src"))
        from config import get_settings
    except ImportError as e:
        # One last try: maybe atoms_core is installed as package in env
        try:
            from src.config import get_settings
        except ImportError:
            print(f"Error importing atoms_core: {e}")
            raise

from supabase import create_client, Client
from factory import load_manifest, generate_mcp

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def get_supabase() -> Client:
    settings = get_settings()
    # We need SERVICE_KEY for writing to registry tables likely
    key = settings.SUPABASE_SERVICE_KEY or settings.SUPABASE_ANON_KEY
    if not key:
        raise ValueError("No Supabase key found in Vault")
    return create_client(settings.SUPABASE_URL, key)

def ensure_firearm_type(supabase: Client, name: str = "General") -> str:
    """Ensures a firearm type exists and returns its ID."""
    res = supabase.table("firearm_types").select("firearm_type_id").eq("name", name).execute()
    if res.data:
        return res.data[0]["firearm_type_id"]

    # Insert
    logger.info(f"Inserting default firearm type: {name}")
    res = supabase.table("firearm_types").insert({"name": name, "description": "Auto-generated default type"}).execute()
    return res.data[0]["firearm_type_id"]

def ensure_platform_metric(supabase: Client, provider_id: str, metric_name: str) -> str:
    """Ensures a platform metric exists and returns its ID."""
    res = supabase.table("platform_metrics").select("metric_id").eq("provider_id", provider_id).eq("metric_name", metric_name).execute()
    if res.data:
        return res.data[0]["metric_id"]

    # Insert
    logger.info(f"Inserting platform metric: {metric_name} for {provider_id}")
    res = supabase.table("platform_metrics").insert({
        "provider_id": provider_id,
        "metric_name": metric_name,
        "data_source": "manifest"
    }).execute()
    return res.data[0]["metric_id"]

def get_core_kpi_id(supabase: Client, name: str) -> str | None:
    res = supabase.table("core_kpis").select("core_kpi_id").eq("name", name).execute()
    if res.data:
        return res.data[0]["core_kpi_id"]
    logger.warning(f"Core KPI not found: {name}")
    return None

def process_connector(path: Path, supabase: Client):
    manifest_path = path / "manifest.yaml"
    if not manifest_path.exists():
        # logger.debug(f"Skipping {path.name}: No manifest.yaml")
        return

    logger.info(f"Processing connector: {path.name}")
    try:
        manifest = load_manifest(manifest_path)
    except Exception as e:
        logger.error(f"Failed to load manifest for {path.name}: {e}")
        return

    # 1. Upsert Provider
    provider_data = {
        "provider_id": manifest.provider_slug,
        "platform_slug": manifest.provider_slug, # assuming same for now
        "display_name": manifest.display_name,
        "naming_rule": manifest.naming_rule
    }
    supabase.table("connector_providers").upsert(provider_data).execute()

    # 2. Upsert Scopes
    general_firearm_id = None # Lazy load

    for scope in manifest.scopes:
        firearm_type_id = None
        if scope.requires_firearm:
            target_type = scope.firearm_type or "General"
            if target_type == "General":
                if not general_firearm_id:
                    general_firearm_id = ensure_firearm_type(supabase, "General")
                firearm_type_id = general_firearm_id
            else:
                firearm_type_id = ensure_firearm_type(supabase, target_type)

        scope_data = {
            "provider_id": manifest.provider_slug,
            "scope_name": scope.name,
            "description": scope.description,
            "requires_firearm": scope.requires_firearm,
            "firearm_type_id": firearm_type_id
        }

        # Check existence by name
        res = supabase.table("connector_scopes").select("scope_id").eq("provider_id", manifest.provider_slug).eq("scope_name", scope.name).execute()
        if res.data:
            scope_id = res.data[0]["scope_id"]
            scope_data["scope_id"] = scope_id
            supabase.table("connector_scopes").upsert(scope_data).execute()
        else:
            supabase.table("connector_scopes").insert(scope_data).execute()

    # 3. KPIs
    for kpi in manifest.kpis:
        metric_id = ensure_platform_metric(supabase, manifest.provider_slug, kpi.raw)
        core_kpi_id = get_core_kpi_id(supabase, kpi.standard)

        if core_kpi_id:
            # Check for existing mapping
            res = supabase.table("kpi_mappings")\
                .select("mapping_id")\
                .eq("provider_id", manifest.provider_slug)\
                .eq("metric_id", metric_id)\
                .eq("core_kpi_id", core_kpi_id)\
                .execute()

            if not res.data:
                supabase.table("kpi_mappings").insert({
                    "provider_id": manifest.provider_slug,
                    "metric_id": metric_id,
                    "core_kpi_id": core_kpi_id,
                    "is_approved": False
                }).execute()

    # 4. Generate MCP
    mcp_path = path / "mcp.py"
    if not mcp_path.exists():
        logger.info(f"Generating mcp.py for {path.name}")
        content = generate_mcp(manifest)
        with open(mcp_path, "w") as f:
            f.write(content)

def main():
    src_dir = Path(__file__).parent.parent / "src"
    if not src_dir.exists():
        logger.error(f"Source directory not found: {src_dir}")
        return

    try:
        supabase = get_supabase()
    except Exception as e:
        logger.critical(f"Failed to initialize Supabase: {e}")
        return

    # Ensure defaults
    ensure_firearm_type(supabase, "General")

    for item in src_dir.iterdir():
        if item.is_dir():
            process_connector(item, supabase)

if __name__ == "__main__":
    main()
