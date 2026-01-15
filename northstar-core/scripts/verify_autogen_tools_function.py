import asyncio
import sys
import os

# Add repo root to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.core.blackboard import Blackboard
from runtime.autogen.modes import tools_function

async def run_scenario():
    print("--- SCENARIO: AutoGen Tools Function ---")
    blackboard = Blackboard()
    async def mock_emit(t, m): print(f"[AGENT] {t}")
    
    inputs = {"input_text": "Count char in 'apple'"}
    
    res = await tools_function.run({}, {}, inputs, blackboard, mock_emit)
    
    print(f"\nResult: {res}")
    
    output = res.get("final_output", "")
    if res["status"] == "PASS":
        print("SUCCESS: AutoGen Tools Mode executed.")
    else:
        print("FAIL: AutoGen Tools Mode failed.")

if __name__ == "__main__":
    asyncio.run(run_scenario())
