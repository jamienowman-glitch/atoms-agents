import asyncio
import sys
import os

# Add repo root to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.core.blackboard import Blackboard
from runtime.crewai.modes import flow_router

async def run_scenario():
    print("--- SCENARIO: CrewAI Flow Router ---")
    blackboard = Blackboard()
    async def mock_emit(t, m): print(f"[AGENT] {t}")
    
    print("\n--- RUN 1: Success Path ---")
    res_1 = await flow_router.run({}, {}, {"outcome": "success"}, blackboard, mock_emit)
    print(f"Result 1: {res_1}")

    print("\n--- RUN 2: Fail Path ---")
    res_2 = await flow_router.run({}, {}, {"outcome": "fail"}, blackboard, mock_emit)
    print(f"Result 2: {res_2}")
    
    # Validation
    try:
        path1 = res_1["state"]["path_taken"]
        path2 = res_2["state"]["path_taken"]
        msg1 = res_1["state"]["final_message"]
        msg2 = res_2["state"]["final_message"]
        
        if path1 == "success" and path2 == "fail":
            if "Finalized" in msg1 and "Finalized" in msg2:
                print("\nSUCCESS: Router passed correctly for both paths!")
            else:
                print("\nFAIL: Finalizer (or_) didn't seem to run?")
        else:
            print(f"\nFAIL: Incorrect paths taken. 1={path1}, 2={path2}")
            
    except Exception as e:
        print(f"\nFAIL: Exception during validation: {e}")

if __name__ == "__main__":
    asyncio.run(run_scenario())
