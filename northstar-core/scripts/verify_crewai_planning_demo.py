import asyncio
import sys
import os

# Add repo root to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.core.blackboard import Blackboard
from runtime.crewai.modes import planning_demo

async def run_scenario():
    print("--- SCENARIO: CrewAI Planning Demo ---")
    blackboard = Blackboard()
    async def mock_emit(t, m): print(f"[AGENT] {t}")
    
    inputs = {"objective": "Launch a Rocket"}
    
    res = await planning_demo.run({}, {}, inputs, blackboard, mock_emit)
    
    print(f"\nResult: {res}")
    
    output = res.get("final_output", "")
    if res["status"] == "PASS" and ("Simulated" in output or "timeline" in output.lower() or "result" in output.lower()):
        print("SUCCESS: Planning Mode executed.")
    else:
        print("FAIL: Planning Mode failed.")

if __name__ == "__main__":
    asyncio.run(run_scenario())
