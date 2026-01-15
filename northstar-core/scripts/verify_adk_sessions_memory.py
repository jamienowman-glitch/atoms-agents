import asyncio
import sys
import os

# Add repo root to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.core.blackboard import Blackboard
from runtime.adk.modes import sessions_memory

async def run_scenario():
    print("--- SCENARIO: ADK Sessions Memory ---")
    blackboard = Blackboard()
    async def mock_emit(t, m): print(f"[ADK] {t}")
    
    inputs = {"session_id": "test_sess_99", "facts": ["Sky is blue", "Grass is green"]}
    
    res = await sessions_memory.run({}, {}, inputs, blackboard, mock_emit)
    
    print(f"\nResult: {res}")
    
    if res["status"] == "PASS" and res["memory_count"] >= 2:
        print("SUCCESS: ADK Sessions Mode executed.")
    else:
        print("FAIL: ADK Sessions Mode failed.")

if __name__ == "__main__":
    asyncio.run(run_scenario())
