import asyncio
import sys
import os

# Add repo root to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.core.blackboard import Blackboard
from runtime.crewai.modes import flow_basic

async def run_scenario():
    print("--- SCENARIO: CrewAI Flow Basic ---")
    blackboard = Blackboard()
    async def mock_emit(t, m): print(f"[AGENT] {t}")
    
    inputs = {"initial_city": "Paris"}
    
    result = await flow_basic.run({}, {}, inputs, blackboard, mock_emit)
    
    print(f"\nFinal Result: {result}")
    
    if result["status"] == "PASS" and result["state"]["city"] == "Paris":
        print("SUCCESS: Flow ran and maintained state!")
    else:
        print("FAIL: Flow did not execute correctly.")

if __name__ == "__main__":
    asyncio.run(run_scenario())
