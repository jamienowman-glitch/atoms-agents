
"""
THE PHONE BOOK: Repository Path Aliasing
Path: atoms-core/src/atoms_core/config/aliases.py

Resolves the absolute path of any Atom in the fleet.
"""
import os
from pathlib import Path

# Defaults assume standard "flat" dev folder layout
# ~/dev/
#   atoms-core/
#   atoms-muscle/
#   atoms-app/

def resolve_path(repo_name: str) -> Path:
    """
    Returns the absolute path to a repo.
    """
    # 1. Trust Env config first (for CI/CD or custom layouts)
    env_key = f"PATH_{repo_name.upper().replace('-', '_')}"
    if os.getenv(env_key):
        return Path(os.getenv(env_key))
    
    # 2. Heuristic: Assume peer directory to atoms-core
    # We are in atoms-core/src/atoms_core/config/aliases.py
    # Root is ../../../..
    current_file = Path(__file__).resolve()
    core_root = current_file.parent.parent.parent.parent
    
    # Check if we are inside the target repo (e.g. self-reference)
    if repo_name == "atoms-core":
        return core_root

    # Assume flat workspace
    workspace_root = core_root.parent
    target = workspace_root / repo_name
    
    if target.exists():
        return target
    
    # Fallback: Try strict UserDev path
    user_home = Path(os.path.expanduser("~"))
    dev_target = user_home / "dev" / repo_name
    if dev_target.exists():
        return dev_target

    raise FileNotFoundError(f"Could not locate repo '{repo_name}'. Set {env_key} or move to standard ~/dev layout.")

# Common Aliases
ATOMS_CORE = resolve_path("atoms-core")
ATOMS_MUSCLE = resolve_path("atoms-muscle")
ATOMS_APP = resolve_path("atoms-app")
ATOMS_UI = resolve_path("atoms-ui")
