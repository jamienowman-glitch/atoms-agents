import pytest
import os
import yaml
import importlib

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REGISTRY_ROOT = os.path.join(REPO_ROOT, "registry", "framework_modes")

def get_all_mode_cards():
    cards = []
    for root, dirs, files in os.walk(REGISTRY_ROOT):
        for f in files:
            if f.endswith(".yaml"):
                cards.append(os.path.join(root, f))
    return cards

@pytest.mark.parametrize("card_path", get_all_mode_cards())
def test_framework_modes_registry_loads(card_path):
    """
    Verifies that every mode card YAML parses and its invoke_entrypoint is importable.
    """
    print(f"\nVerifying: {card_path}")
    
    # 1. Parse YAML
    try:
        with open(card_path, "r") as f:
            card = yaml.safe_load(f)
    except Exception as e:
        pytest.fail(f"YAML Parse Error in {card_path}: {e}")
        
    entrypoint = card.get("invoke_entrypoint")
    if not entrypoint:
        pytest.fail(f"Missing 'invoke_entrypoint' in {card_path}")
        
    # 2. Verify Import
    try:
        module_name, func_name = entrypoint.split(":")
        module = importlib.import_module(module_name)
        func = getattr(module, func_name)
        assert callable(func), f"Entrypoint {entrypoint} is not callable"
    except ImportError as e:
        pytest.fail(f"Import Error for {entrypoint}: {e}")
    except AttributeError:
        pytest.fail(f"Function {func_name} not found in {module_name}")
