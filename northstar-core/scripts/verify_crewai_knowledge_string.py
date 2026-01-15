import asyncio
import sys
import os

# Add repo root to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.core.blackboard import Blackboard
from runtime.crewai.modes import knowledge_string

async def run_scenario():
    print("--- SCENARIO: CrewAI String Knowledge ---")
    blackboard = Blackboard()
    async def mock_emit(t, m): print(f"[AGENT] {t}")
    
    inputs = {"question": "How old is John?"}
    res = await knowledge_string.run({}, {}, inputs, blackboard, mock_emit)
    
    print(f"\nResult: {res}")
    
    output = res.get("final_output", "")
    if res["status"] == "PASS" and ("John" in output or "Simulated" in output):
        print("SUCCESS: String Knowledge Mode executed.")
    else:
        print("FAIL: String Knowledge Mode failed.")

if __name__ == "__main__":
    asyncio.run(run_scenario())
