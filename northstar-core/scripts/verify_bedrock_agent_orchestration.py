import asyncio
import sys
import os

# Add repo root to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.core.blackboard import Blackboard
from runtime.bedrock.modes import agent_orchestration

async def run_scenario():
    print("--- SCENARIO: Bedrock Agent Orchestration ---")
    blackboard = Blackboard()
    async def mock_emit(t, m): print(f"[BEDROCK] {t}")
    
    inputs = {"agent_id": "MOCK_AGENT", "input_text": "Book a flight"}
    
    res = await agent_orchestration.run({}, {}, inputs, blackboard, mock_emit)
    
    print(f"\nResult: {res}")
    
    if res["status"] == "PASS" and "Simulated" in res.get("final_response", ""):
        print("SUCCESS: Bedrock Agent Mode executed.")
    else:
        print("FAIL: Bedrock Agent Mode failed.")

if __name__ == "__main__":
    asyncio.run(run_scenario())
