import asyncio
import sys
import os

# Add repo root to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.core.blackboard import Blackboard
from runtime.adk.modes import simulation

async def run_scenario():
    print("--- SCENARIO: ADK Simulation ---")
    blackboard = Blackboard()
    async def mock_emit(t, m): print(f"[ADK] {t}")
    
    inputs = {"prompt": "Test Scenario", "num_turns": 2}
    
    res = await simulation.run({}, {}, inputs, blackboard, mock_emit)
    
    print(f"\nResult: {res}")
    
    trace = res.get("trace", [])
    if res["status"] == "PASS" and len(trace) > 0:
        print("SUCCESS: ADK Simulation Mode executed.")
    else:
        print("FAIL: ADK Simulation Mode failed.")

if __name__ == "__main__":
    asyncio.run(run_scenario())
