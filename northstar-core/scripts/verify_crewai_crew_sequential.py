import asyncio
import sys
import os

# Add repo root to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.core.blackboard import Blackboard
from runtime.crewai.modes import crew_sequential

async def run_scenario():
    print("--- SCENARIO: CrewAI Crew Sequential (Inline) ---")
    blackboard = Blackboard()
    async def mock_emit(t, m): print(f"[AGENT] {t}")
    
    flow_card = {
        "agents": [
            {"name": "researcher", "role": "Researcher", "goal": "Research", "backstory": "Bio"}
        ],
        "tasks": [
            {"description": "Research AI", "expected_output": "Summary", "agent": "researcher"}
        ]
    }
    
    inputs = {"topic": "AI"}
    
    res = await crew_sequential.run({}, flow_card, inputs, blackboard, mock_emit)
    
    print(f"\nResult: {res}")
    
    output = res.get("final_output", "")
    if res["status"] == "PASS" and ("Simulated" in output or "Summary" in output):
        print("SUCCESS: Crew Sequential Mode executed.")
    else:
        print("FAIL: Crew Sequential Mode failed.")

if __name__ == "__main__":
    asyncio.run(run_scenario())
