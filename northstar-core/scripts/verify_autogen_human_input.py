import asyncio
import sys
import os

# Add repo root to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.core.blackboard import Blackboard
from runtime.autogen.modes import human_input

async def run_scenario():
    print("--- SCENARIO: AutoGen Human Input ---")
    blackboard = Blackboard()
    async def mock_emit(t, m): print(f"[AGENT] {t}")
    
    # IMPORTANT: ask_user=False to test wiring without blocking on stdin
    inputs = {"ask_user": False}
    
    res = await human_input.run({}, {}, inputs, blackboard, mock_emit)
    
    print(f"\nResult: {res}")
    
    output = res.get("final_output", "")
    if res["status"] == "PASS":
        print("SUCCESS: Human Input Mode executed.")
    else:
        print("FAIL: Human Input Mode failed.")

if __name__ == "__main__":
    asyncio.run(run_scenario())
