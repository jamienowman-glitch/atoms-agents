import asyncio
import sys
import os

# Add repo root to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.core.blackboard import Blackboard
from runtime.strands.modes import linear_sequence

async def run_scenario():
    print("--- SCENARIO: Strands Linear Sequence ---")
    blackboard = Blackboard()
    
    events = []
    async def mock_emit(t, m): 
        print(f"[STRANDS] {t}")
        events.append(m)
    
    input_steps = ["Load Data", "Transform Data", "Save Data"]
    inputs = {"steps": input_steps}
    
    res = await linear_sequence.run({}, {}, inputs, blackboard, mock_emit)
    
    print(f"\nResult: {res}")
    
    log = res.get("execution_log", [])
    
    # Validation logic
    success = True
    if res["status"] != "PASS":
        success = False
        print("FAIL: Status not PASS")
    
    if len(log) != 3:
        success = False
        print(f"FAIL: Expected 3 steps, got {len(log)}")
        
    for i, entry in enumerate(log):
        if entry["step"] != input_steps[i]:
            success = False
            print(f"FAIL: Step mismatch at index {i}. Expected {input_steps[i]}, got {entry['step']}")

    if success:
        print("SUCCESS: Strands Linear Mode executed correctly.")
    else:
        print("FAIL: Verification failed.")

if __name__ == "__main__":
    asyncio.run(run_scenario())
