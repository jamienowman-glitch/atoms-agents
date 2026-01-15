import pytest
import yaml
import glob
import os
import importlib
from pathlib import Path

REPO_ROOT = Path(__file__).parent.parent
REGISTRY_DIR = REPO_ROOT / "registry/framework_modes"

def get_mode_files():
    return glob.glob(str(REGISTRY_DIR / "**/*.yaml"), recursive=True)

@pytest.mark.parametrize("file_path", get_mode_files())
def test_mode_entrypoint_import(file_path):
    """
    Validates that the 'invoke_entrypoint' defined in the mode card
    can be imported and is a callable.
    """
    with open(file_path, 'r') as f:
        data = yaml.safe_load(f)
        
    entrypoint = data.get("invoke_entrypoint")
    if not entrypoint:
        pytest.fail(f"Missing 'invoke_entrypoint' in {file_path}")

    # Support both ':' and '.' separators
    if ":" in entrypoint:
        module_path, func_name = entrypoint.split(":")
    else:
        parts = entrypoint.split(".")
        module_path = ".".join(parts[:-1])
        func_name = parts[-1]

    try:
        mod = importlib.import_module(module_path)
    except ImportError as e:
        pytest.fail(f"Could not import module '{module_path}' for {file_path}.\nError: {e}")

    func = getattr(mod, func_name, None)
    if not func:
        pytest.fail(f"Module '{module_path}' does not have attribute '{func_name}'")
        
    if not callable(func):
        pytest.fail(f"'{entrypoint}' is not callable.")
