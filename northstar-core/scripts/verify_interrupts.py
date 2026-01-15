import asyncio
import sys
import os

# Add repo root to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.core.blackboard import Blackboard
from runtime.langgraph.modes import human_approval

async def verify_interrupts():
    blackboard = Blackboard()
    async def mock_emit(t, m): 
        print(f"[EMIT] {t}")

    print("--- 1. STARTING FLOW ---")
    inputs_start = {"approval_question": "Launch missile?"}
    
    # Run 1: Start
    res1 = await human_approval.run({}, {}, inputs_start, blackboard, mock_emit)
    print(f"Result 1: {res1['status']}")
    
    if res1['status'] != "INTERRUPTED":
        print("FAIL: Did not interrupt.")
        return

    thread_id = res1["thread_id"]
    print(f"Captured Thread ID: {thread_id}")

    print("\n--- 2. RESUMING FLOW (APPROVE) ---")
    inputs_resume = {"thread_id": thread_id, "resume_action": "approve"}
    
    # Run 2: Resume
    res2 = await human_approval.run({}, {}, inputs_resume, blackboard, mock_emit)
    print(f"Result 2: {res2['status']}")
    print(f"Output 2: {res2['final_output']}")
    
    if res2['status'] != "PASS" or "authorized" not in res2['final_output'].lower():
        print("FAIL: Did not pass or authorize.")
        return

    print("\n--- SUCCESS: Interrupt Cycle Verified ---")

if __name__ == "__main__":
    asyncio.run(verify_interrupts())
