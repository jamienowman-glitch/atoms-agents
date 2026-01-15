import asyncio
import sys
import os

# Add repo root to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.core.blackboard import Blackboard
from runtime.langgraph.modes import conditional_router

async def run_scenario():
    print("--- SCENARIO: LangGraph Conditional Router ---")
    blackboard = Blackboard()
    async def mock_emit(t, m): print(f"[LANGGRAPH] {t}")
    
    # Pathway A
    print("\nTesting Path A:")
    inputs_a = {"decision": "A"}
    res_a = await conditional_router.run({}, {}, inputs_a, blackboard, mock_emit)
    print(f"Result A: {res_a}")

    # Pathway B
    print("\nTesting Path B:")
    inputs_b = {"decision": "B"}
    res_b = await conditional_router.run({}, {}, inputs_b, blackboard, mock_emit)
    print(f"Result B: {res_b}")
    
    if res_a["path_taken"] == "A" and res_b["path_taken"] == "B":
        print("\nSUCCESS: LangGraph Router Mode executed both paths correctly.")
    else:
        print("\nFAIL: Paths did not match expectations.")

if __name__ == "__main__":
    asyncio.run(run_scenario())
