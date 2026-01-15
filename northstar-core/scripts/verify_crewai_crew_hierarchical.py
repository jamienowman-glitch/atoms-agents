import asyncio
import sys
import os

# Add repo root to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.core.blackboard import Blackboard
from runtime.crewai.modes import crew_hierarchical

async def run_scenario():
    print("--- SCENARIO: CrewAI Crew Hierarchical (Inline) ---")
    blackboard = Blackboard()
    async def mock_emit(t, m): print(f"[AGENT] {t}")
    
    flow_card = {
        "agents": [
            {"name": "writer", "role": "Writer", "goal": "Write", "backstory": "Bio"}
        ],
        "tasks": [
            {"description": "Write poem", "expected_output": "Poem", "agent": "writer"}
        ]
    }
    
    inputs = {"topic": "Poetry"}
    
    res = await crew_hierarchical.run({}, flow_card, inputs, blackboard, mock_emit)
    
    print(f"\nResult: {res}")
    
    output = res.get("final_output", "")
    if res["status"] == "PASS" and ("Simulated" in output or "Poem" in output or "Result" in output):
        print("SUCCESS: Crew Hierarchical Mode executed.")
    else:
        print("FAIL: Crew Hierarchical Mode failed.")

if __name__ == "__main__":
    asyncio.run(run_scenario())
