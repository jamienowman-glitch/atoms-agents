import asyncio
import sys
import os

# Add repo root to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.core.blackboard import Blackboard
from runtime.autogen.modes import two_agent_chat

async def run_scenario():
    print("--- SCENARIO: AutoGen Two-Agent Chat ---")
    blackboard = Blackboard()
    async def mock_emit(t, m): print(f"[AGENT] {t}")
    
    inputs = {"message": "Hi there"}
    
    res = await two_agent_chat.run({}, {}, inputs, blackboard, mock_emit)
    
    print(f"\nResult: {res}")
    
    output = res.get("final_output", "")
    if res["status"] == "PASS":
        print("SUCCESS: Two-Agent Mode executed.")
    else:
        print("FAIL: Two-Agent Mode failed.")

if __name__ == "__main__":
    asyncio.run(run_scenario())
