import asyncio
import sys
import os

# Add repo root to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.core.blackboard import Blackboard
from runtime.adk.modes import tools_custom

async def run_scenario():
    print("--- SCENARIO: ADK Custom Tools ---")
    blackboard = Blackboard()
    async def mock_emit(t, m): print(f"[ADK] {t}")
    
    inputs = {"action": "Check weather in NYC"}
    
    res = await tools_custom.run({}, {}, inputs, blackboard, mock_emit)
    
    print(f"\nResult: {res}")
    
    if res["status"] == "PASS" and "72" in str(res.get("tool_result")):
        print("SUCCESS: ADK Tools Mode executed.")
    else:
        print("FAIL: ADK Tools Mode failed.")

if __name__ == "__main__":
    asyncio.run(run_scenario())
