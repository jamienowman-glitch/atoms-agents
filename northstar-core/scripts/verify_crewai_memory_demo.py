import asyncio
import sys
import os

# Add repo root to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.core.blackboard import Blackboard
from runtime.crewai.modes import memory_demo

async def run_scenario():
    print("--- SCENARIO: CrewAI Memory Demo ---")
    blackboard = Blackboard()
    async def mock_emit(t, m): print(f"[AGENT] {t}")
    
    inputs = {"topic": "The Moon"}
    
    res = await memory_demo.run({}, {}, inputs, blackboard, mock_emit)
    
    print(f"\nResult: {res}")
    
    output = res.get("final_output", "")
    if res["status"] == "PASS" and ("Simulated" in output or "fact" in output.lower()):
        print("SUCCESS: Memory Mode executed.")
    else:
        print("FAIL: Memory Mode failed.")

if __name__ == "__main__":
    asyncio.run(run_scenario())
