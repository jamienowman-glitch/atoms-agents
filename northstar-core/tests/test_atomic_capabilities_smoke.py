import pytest
import os
import importlib
from src.models.types import ModelSpec, Vendor

# Re-use the capability loader logic for a proper pytest
def load_capability_module(path: str):
    spec = importlib.util.spec_from_file_location("capability_module", path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module

@pytest.mark.parametrize("vendor, cap_file", [
    ("openai", "web_search.py"),
    ("openai", "code_execution.py"),
    ("anthropic", "computer_use.py"),
    # Add more as they are implemented
])
def test_atomic_capability_structure(vendor, cap_file):
    base_path = f"src/capabilities/{vendor}/{cap_file}"
    if not os.path.exists(base_path):
        pytest.skip(f"Capability {base_path} not found")
        
    module = load_capability_module(base_path)
    assert hasattr(module, "Capability"), f"{base_path} missing Capability class"
    cap = module.Capability
    
    assert hasattr(cap, "capability_id")
    assert hasattr(cap, "test_plan")
    assert hasattr(cap, "build_request")

if __name__ == "__main__":
    # verification script logic is separate
    pass
