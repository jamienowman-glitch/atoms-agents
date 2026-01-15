import asyncio
import sys
import os

# Add repo root to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.core.blackboard import Blackboard
from runtime.bedrock.modes import action_groups

async def run_scenario():
    print("--- SCENARIO: Bedrock Action Groups ---")
    blackboard = Blackboard()
    async def mock_emit(t, m): print(f"[BEDROCK] {t}")
    
    inputs = {"action": "Check order 123"}
    
    res = await action_groups.run({}, {}, inputs, blackboard, mock_emit)
    
    print(f"\nResult: {res}")
    
    if res["status"] == "PASS" and "Shipped" in res.get("final_result", ""):
        print("SUCCESS: Bedrock Action Groups Mode executed.")
    else:
        print("FAIL: Bedrock Action Groups Mode failed.")

if __name__ == "__main__":
    asyncio.run(run_scenario())
