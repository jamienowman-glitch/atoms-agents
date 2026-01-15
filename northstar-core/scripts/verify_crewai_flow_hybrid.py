import asyncio
import sys
import os

# Add repo root to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.core.blackboard import Blackboard
from runtime.crewai.modes import flow_hybrid

async def run_scenario():
    print("--- SCENARIO: CrewAI Hybrid Flow (Flow + Crew) ---")
    blackboard = Blackboard()
    async def mock_emit(t, m): print(f"[AGENT] {t}")
    
    inputs = {"topic": "Mars"}
    res = await flow_hybrid.run({}, {}, inputs, blackboard, mock_emit)
    
    print(f"\nResult: {res}")
    
    if res["status"] == "PASS" and "Mars" in res["state"]["crew_result"]:
        print("SUCCESS: Hybrid Flow executed and returned result (Simulated or Real).")
    else:
        print("FAIL: Hybrid Flow failed.")

if __name__ == "__main__":
    asyncio.run(run_scenario())
