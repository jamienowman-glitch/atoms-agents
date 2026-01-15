import pytest
from northstar.registry.loader import RegistryLoader
from northstar.registry.schemas import ModeCard

def test_loader_loads_modes(tmp_path):
    # Setup temp registry dir
    registry_root = tmp_path / "registry"
    modes_dir = registry_root / "modes"
    modes_dir.mkdir(parents=True)
    
    yaml_content = """
card_type: mode
id: test-mode
framework: test
official_name: Test Mode
invoke_primitive: test
entrypoint: src.test.run
"""
    (modes_dir / "test.yaml").write_text(yaml_content, encoding="utf-8")
    
    loader = RegistryLoader(str(registry_root))
    cards = loader.load_cards_from_dir("modes")
    
    assert len(cards) == 1
    card = cards[0]
    assert isinstance(card, ModeCard)
    assert card.id == "test-mode"
    assert card.official_name == "Test Mode"

def test_loader_skips_invalid_yaml(tmp_path):
    registry_root = tmp_path / "registry"
    modes_dir = registry_root / "modes"
    modes_dir.mkdir(parents=True)
    
    (modes_dir / "bad.yaml").write_text("Likely invalid: [ unclosed list", encoding="utf-8")
    
    loader = RegistryLoader(str(registry_root))
    # It should raise ValueError per implementation
    with pytest.raises(ValueError):
        loader.load_cards_from_dir("modes")
