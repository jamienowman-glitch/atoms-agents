import asyncio
import sys
import os

# Add repo root to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.core.blackboard import Blackboard
from runtime.autogen.modes import code_execution

async def run_scenario():
    print("--- SCENARIO: AutoGen Code Execution ---")
    blackboard = Blackboard()
    async def mock_emit(t, m): print(f"[AGENT] {t}")
    
    inputs = {"code_task": "Calculate 5 * 10"}
    
    res = await code_execution.run({}, {}, inputs, blackboard, mock_emit)
    
    print(f"\nResult: {res}")
    
    output = res.get("final_output", "")
    if res["status"] == "PASS":
        print("SUCCESS: Code Execution Mode executed.")
    else:
        print("FAIL: Code Execution Mode failed.")

if __name__ == "__main__":
    asyncio.run(run_scenario())
