import asyncio
import sys
import os
import uuid

# Add repo root to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.core.blackboard import Blackboard
from runtime.langgraph.modes import memory

async def run_scenario():
    user_id = "agent_007"
    print(f"--- SCENARIO: Long Term Memory for {user_id} ---")
    blackboard = Blackboard()
    async def mock_emit(t, m): print(f"[AGENT] {t}")  # Print emit messages

    # --- SESSION 1: Teaching ---
    print("\n--- Session 1: Storing Memory ---")
    inputs_1 = {
        "user_id": user_id,
        "input_text": "Please remember that my code name is Falcon."
    }
    # Using run() directly to simulate engine call
    res_1 = await memory.run({}, {}, inputs_1, blackboard, mock_emit)
    print(f"Output 1: {res_1['final_output']}")

    # --- SESSION 2: Recall (New Thread) ---
    print("\n--- Session 2: Recalling Memory (New Thread) ---")
    inputs_2 = {
        "user_id": user_id,
        "input_text": "What did I tell you?"
    }
    res_2 = await memory.run({}, {}, inputs_2, blackboard, mock_emit)
    output_2 = res_2['final_output']
    print(f"Output 2: {output_2}")
    
    if "Falcon" in output_2:
        print("\nSUCCESS: Memory Recalled Correctly!")
    else:
        print("\nFAIL: Did not recall 'Falcon'.")

if __name__ == "__main__":
    asyncio.run(run_scenario())
