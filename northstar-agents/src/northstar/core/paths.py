

from pathlib import Path

def get_repo_root() -> Path:
    # Assuming this code runs within src/northstar/core/paths.py
    # We want to find the root of the repo. 
    # Current file: src/northstar/core/paths.py -> ... -> ... -> repo_root
    # ../../../..
    return Path(__file__).resolve().parent.parent.parent.parent

def get_state_dir() -> Path:
    """Returns .northstar/state relative to repo root, creating it if needed."""
    path = get_repo_root() / ".northstar" / "state"
    path.mkdir(parents=True, exist_ok=True)
    return path

def get_artifacts_dir() -> Path:
    """Returns .northstar/artifacts relative to repo root, creating it if needed."""
    path = get_repo_root() / ".northstar" / "artifacts"
    path.mkdir(parents=True, exist_ok=True)
    return path
