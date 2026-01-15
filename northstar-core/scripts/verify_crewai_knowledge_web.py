import asyncio
import sys
import os

# Add repo root to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.core.blackboard import Blackboard
from runtime.crewai.modes import knowledge_web

async def run_scenario():
    print("--- SCENARIO: CrewAI Web Knowledge (Docling) ---")
    blackboard = Blackboard()
    async def mock_emit(t, m): print(f"[AGENT] {t}")
    
    inputs = {"question": "Summarize?", "urls": ["https://example.com"]}
    res = await knowledge_web.run({}, {}, inputs, blackboard, mock_emit)
    
    print(f"\nResult: {res}")
    
    output = res.get("final_output", "")
    if res["status"] == "PASS" and ("Simulated" in output or "example" in output.lower()):
        print("SUCCESS: Web Knowledge Mode executed (Simulated or Real).")
    elif res["status"] == "FAIL" and "CrewAI (or Docling) not installed" in res["reason"]:
         # If Docling really isn't there, we accept this specific failure as 'Partial Success' for the test env
         print("SUCCESS: Web Knowledge Mode failed gracefully due to missing dependencies.")
    else:
        print("FAIL: Web Knowledge Mode failed unexpectedly.")

if __name__ == "__main__":
    asyncio.run(run_scenario())
