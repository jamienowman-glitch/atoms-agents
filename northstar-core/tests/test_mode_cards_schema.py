import pytest
import yaml
import glob
import os
from pathlib import Path
from src.core.schemas.mode_card_v1 import ModeCardV1

REPO_ROOT = Path(__file__).parent.parent
REGISTRY_DIR = REPO_ROOT / "registry/framework_modes"

def get_mode_files():
    return glob.glob(str(REGISTRY_DIR / "**/*.yaml"), recursive=True)

@pytest.mark.parametrize("file_path", get_mode_files())
def test_mode_card_schema(file_path):
    """
    Validates that every YAML file in registry/framework_modes
    adheres to the ModeCardV1 schema.
    """
    with open(file_path, 'r') as f:
        data = yaml.safe_load(f)
    
    # Validation
    try:
        # Pydantic will raise ValidationError if missing fields
        ModeCardV1(**data)
    except Exception as e:
        relative_path = os.path.relpath(file_path, REPO_ROOT)
        pytest.fail(f"Schema Validation Failed for {relative_path}:\n{e}")
