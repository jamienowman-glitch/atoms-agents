
import os
import pytest
from northstar.registry.loader import RegistryLoader
from northstar.registry.schemas import ModelCard, CapabilityCard, CapabilityBindingCard

CARDS_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../src/northstar/registry/cards"))

@pytest.fixture
def loader():
    return RegistryLoader(CARDS_ROOT)

def test_load_models(loader):
    cards = loader.load_cards_from_dir("models")
    assert len(cards) > 0
    for card in cards:
        assert isinstance(card, ModelCard)
        assert card.model_id
        assert card.provider_id
        assert card.model_or_deployment_id

def test_load_capabilities(loader):
    cards = loader.load_cards_from_dir("capabilities")
    assert len(cards) > 0
    for card in cards:
        assert isinstance(card, CapabilityCard)
        # Check uniqueness of IDs
        ids = [c.capability_id for c in cards]
        assert len(ids) == len(set(ids)), f"Duplicate capability IDs found: {ids}"

def test_load_bindings(loader):
    bindings = loader.load_cards_from_dir("capability_bindings")
    assert len(bindings) > 0
    for card in bindings:
        assert isinstance(card, CapabilityBindingCard)
        assert card.binding_id

def test_binding_integrity(loader):
    # Verify every binding references a known capability
    bindings = loader.load_cards_from_dir("capability_bindings")
    capabilities = {c.capability_id: c for c in loader.load_cards_from_dir("capabilities")}
    
    # We can't strictly verify model_id ref because bindings use "model_or_deployment_id",
    # which matches ModelCard.model_or_deployment_id, but the binding doesn't store the registry model_id.
    # We can check if *some* model exists with that deployment id + provider?
    
    models = loader.load_cards_from_dir("models")
    deployment_map = {(m.provider_id, m.model_or_deployment_id) for m in models}
    
    for b in bindings:
        # Check Capability Exists
        assert b.capability_id in capabilities, f"Binding {b.binding_id} references unknown capability {b.capability_id}"
        
        # Check Model Deployment exists (optional if we allow bindings for models not yet in registry?)
        # But for correctness, it should exist.
        # Note: TSV generation ensures this, but let's test.
        key = (b.provider_id, b.model_or_deployment_id)
        assert key in deployment_map, f"Binding {b.binding_id} references unknown model deployment {key}"
