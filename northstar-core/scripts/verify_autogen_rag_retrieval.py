import asyncio
import sys
import os

# Add repo root to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.core.blackboard import Blackboard
from runtime.autogen.modes import rag_retrieval

async def run_scenario():
    print("--- SCENARIO: AutoGen RAG ---")
    blackboard = Blackboard()
    async def mock_emit(t, m): print(f"[AGENT] {t}")
    
    inputs = {"query": "Explain quantum physics"}
    
    res = await rag_retrieval.run({}, {}, inputs, blackboard, mock_emit)
    
    print(f"\nResult: {res}")
    
    output = res.get("final_output", "")
    if res["status"] == "PASS":
        print("SUCCESS: RAG Mode executed.")
    else:
        print("FAIL: RAG Mode failed.")

if __name__ == "__main__":
    asyncio.run(run_scenario())
