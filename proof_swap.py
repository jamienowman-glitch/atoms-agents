import sys
import os
import asyncio
from unittest.mock import MagicMock, patch

# Add src to path
sys.path.append(os.path.join(os.path.dirname(__file__), "src"))

from atoms_agents.workbench.main import chat, ChatRequest
from atoms_agents.runtime.gateway import LLMGateway

async def run_proof():
    print(">>> Starting Proof of Concept: Reasoning Profile Swap")

    # Mock Gateway to avoid real calls
    mock_gateway = MagicMock(spec=LLMGateway)

    def side_effect(messages, model_card, provider_config, stream=False, **kwargs):
        # Inspect system prompt to verify reasoning profile injection
        system_prompts = [m["content"] for m in messages if m["role"] == "system"]
        full_system = "\n".join(system_prompts)

        reasoning = "UNKNOWN"
        if "Think step by step" in full_system:
            reasoning = "COT"
        elif "Answer directly" in full_system:
            reasoning = "DIRECT"

        return {
            "content": f"Mock Response via {reasoning}",
            "model_id": model_card.model_id if hasattr(model_card, 'model_id') else str(model_card)
        }

    mock_gateway.generate.side_effect = side_effect

    # Patch resolve_gateway to return our mock
    with patch("atoms_agents.workbench.main.resolve_gateway", return_value=mock_gateway):

        # Test Agent COT
        print("\n--- Testing Agent COT ---")
        req_cot = ChatRequest(agent_id="agent_cot", message="Hello")
        resp_cot = await chat(req_cot)
        print(f"Agent ID: {resp_cot['agent_id']}")
        print(f"Reasoning: {resp_cot['reasoning_profile']}")
        print(f"Response: {resp_cot['response']}")

        assert "COT" in resp_cot["response"]
        assert resp_cot["reasoning_profile"] == "rp_cot"

        # Test Agent Direct
        print("\n--- Testing Agent Direct ---")
        req_direct = ChatRequest(agent_id="agent_direct", message="Hello")
        resp_direct = await chat(req_direct)
        print(f"Agent ID: {resp_direct['agent_id']}")
        print(f"Reasoning: {resp_direct['reasoning_profile']}")
        print(f"Response: {resp_direct['response']}")

        assert "DIRECT" in resp_direct["response"]
        assert resp_direct["reasoning_profile"] == "rp_direct"

        # Verify Model ID Constant
        assert resp_cot["model_id"] == resp_direct["model_id"]
        print(f"\nModel ID kept constant: {resp_cot['model_id']}")

    print("\n>>> Proof Successful: Swapped reasoning profile while keeping model constant.")

if __name__ == "__main__":
    asyncio.run(run_proof())
