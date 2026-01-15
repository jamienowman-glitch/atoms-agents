import asyncio
import sys
import os

# Add repo root to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.core.blackboard import Blackboard
from runtime.crewai.modes import tools_custom

async def run_scenario():
    print("--- SCENARIO: CrewAI Custom Tools ---")
    blackboard = Blackboard()
    async def mock_emit(t, m): print(f"[AGENT] {t}")
    
    inputs = {"text_input": "ABC"}
    
    res = await tools_custom.run({}, {}, inputs, blackboard, mock_emit)
    
    print(f"\nResult: {res}")
    
    output = res.get("final_output", "")
    if res["status"] == "PASS" and ("3" in output or "Simulated" in output):
        print("SUCCESS: Custom Tools Mode executed (Tool used or simulated).")
    else:
        print("FAIL: Custom Tools Mode failed.")

if __name__ == "__main__":
    asyncio.run(run_scenario())
