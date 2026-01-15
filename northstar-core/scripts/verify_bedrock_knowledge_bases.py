import asyncio
import sys
import os

# Add repo root to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.core.blackboard import Blackboard
from runtime.bedrock.modes import knowledge_bases

async def run_scenario():
    print("--- SCENARIO: Bedrock Knowledge Bases ---")
    blackboard = Blackboard()
    async def mock_emit(t, m): print(f"[BEDROCK] {t}")
    
    inputs = {"kb_id": "MOCK_KB", "query": "Safety Policy"}
    
    res = await knowledge_bases.run({}, {}, inputs, blackboard, mock_emit)
    
    print(f"\nResult: {res}")
    
    if res["status"] == "PASS" and "Simulated" in res.get("generated_answer", ""):
        print("SUCCESS: Bedrock KB Mode executed.")
    else:
        print("FAIL: Bedrock KB Mode failed.")

if __name__ == "__main__":
    asyncio.run(run_scenario())
