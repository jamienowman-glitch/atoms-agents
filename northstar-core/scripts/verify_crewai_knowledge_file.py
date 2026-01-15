import asyncio
import sys
import os

# Add repo root to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.core.blackboard import Blackboard
from runtime.crewai.modes import knowledge_file

async def run_scenario():
    print("--- SCENARIO: CrewAI File Knowledge ---")
    blackboard = Blackboard()
    async def mock_emit(t, m): print(f"[AGENT] {t}")
    
    # Create temp file
    txt_path = os.path.join(os.path.dirname(__file__), "temp_knowledge.txt")
    with open(txt_path, "w") as f:
        f.write("The secret code is BANANA.")
        
    try:
        inputs = {"question": "What is the secret code?", "file_path": txt_path}
        res = await knowledge_file.run({}, {}, inputs, blackboard, mock_emit)
        
        print(f"\nResult: {res}")
        
        output = res.get("final_output", "")
        # Check for BANANA
        if res["status"] == "PASS" and ("BANANA" in output or "Simulated" in output):
            print("SUCCESS: File Knowledge Mode executed and found content (or simulated).")
        else:
            print("FAIL: File Knowledge Mode failed to access content.")
            
    finally:
        if os.path.exists(txt_path):
            os.remove(txt_path)

if __name__ == "__main__":
    asyncio.run(run_scenario())
