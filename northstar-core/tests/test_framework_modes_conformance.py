import pytest
import os
import yaml
import asyncio
from src.core.blackboard import Blackboard

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
def test_mode_invoker_conformance(card_path):
    """
    Verifies that every mode card points to a valid invoker and runs a smoke test.
    """
    print(f"\nTesting Mode Card: {card_path}")
    
    # 1. Load Card
    with open(card_path, "r") as f:
        card = yaml.safe_load(f)
    
    entrypoint = card.get("invoke_entrypoint")
    assert entrypoint, "invoke_entrypoint is missing"
    
    # 2. Import Invoker
    module_name, func_name = entrypoint.split(":")
    import importlib
    module = importlib.import_module(module_name)
    run_func = getattr(module, func_name)
    assert callable(run_func), "Entrypoint must be callable"

    # 3. Setup Mocks
    async def async_test_body():
        blackboard = Blackboard()
        blackboard.write("input_text", "Conformance Test Input")
        
        captured_events = []
        async def mock_emit(text, meta):
            captured_events.append(meta)
            print(f"[EMIT] {meta.get('event_type')}: {text}")

        # 4. Create Mock Flow/Inputs
        mock_inputs = {"input_text": "Hello World", "user_message": "Hello"}
        mock_flow_card = {
            "steps": [{"agent_id": "mock_agent", "template_id": "default"}],
            "participants": [{"id": "mock_agent", "agent_id": "registry/agents/agent_intern_01.yaml"}] 
        }
        
        # 5. Run Invoker
        result = await run_func(
            mode_card=card,
            flow_card=mock_flow_card,
            inputs=mock_inputs,
            blackboard=blackboard,
            emit=mock_emit
        )
        
        # 6. Assertions
        assert isinstance(result, dict), "Result must be a dict"
        if result.get("status") != "SKIP":
            assert "status" in result
            
    # Run Async Wrapper
    asyncio.run(async_test_body())
