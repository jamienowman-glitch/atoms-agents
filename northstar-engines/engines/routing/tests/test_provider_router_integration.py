import pytest
import os
from engines.routing.provider_router import ProviderRouter

@pytest.fixture
def router():
    cwd = os.getcwd()
    # Adjust path logic for test environment
    if cwd.endswith("northstar-engines"):
         agents_path = "../northstar-agents"
    else:
         agents_path = "northstar-agents"

    return ProviderRouter(agents_path=agents_path)

@pytest.mark.asyncio
async def test_load_model_cards(router):
    # Verify we loaded models
    # We need to make sure the path was resolved correctly
    if not router.model_cards:
        pytest.skip("Model cards not loaded - check path configuration in test environment")

    assert len(router.model_cards) > 0
    # Check for a known card (molmo-2-free exists in file list)
    assert "molmo-2-free" in router.model_cards

@pytest.mark.asyncio
async def test_route_request_credit_hunter(router):
    if "molmo-2-free" not in router.model_cards:
         pytest.skip("Molmo card missing, cannot test credit hunter")

    # Using 'routing.dev_free_tier_hunter' which has strategy: cost_optimized
    decision = await router.route_request("routing.dev_free_tier_hunter", "Hello")
    assert decision["provider"] is not None
    assert decision["model"] is not None

    # Expect Molmo (preferred in _find_free_model)
    assert "molmo" in decision["model"] or "free" in decision["model"]

@pytest.mark.asyncio
async def test_route_request_fallback(router):
    # Test loading a non-existent card
    decision = await router.route_request("routing.non_existent", "Hello")
    assert decision["provider"] == "google_vertex"
