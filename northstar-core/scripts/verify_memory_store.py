import asyncio
import sys
import os
import argparse
import uuid

# Add repo root to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.core.blackboard import Blackboard
from runtime.langgraph.modes import human_approval

async def run_scenario():
    user_id = "user_123"
    
    print(f"--- SCENARIO: Shared Memory for User {user_id} ---")
    blackboard = Blackboard()
    async def mock_emit(t, m): print(f"[EMIT] {t}")

    # --- THREAD A: Save Memory ---
    print("\n--- Thread A: Saving Memory 'I like robots' ---")
    thread_a = str(uuid.uuid4())
    inputs_a = {
        "thread_id": thread_a, 
        "user_id": user_id,
        "approval_question": "What should I know?"
    }
    
    # 1. Start Flow A
    res = await human_approval.run({}, {}, inputs_a, blackboard, mock_emit)
    if res['status'] == "INTERRUPTED":
        # 2. Resume Flow A with Memory
        inputs_resume = {
            "thread_id": thread_a,
            "user_id": user_id, # Ensure user_id is passed during resume
            "resume_action": "approve",
            "save_memory": "I like robots"
        }
        res_resume = await human_approval.run({}, {}, inputs_resume, blackboard, mock_emit)
        print("Thread A Finished.")

    # --- THREAD B: Read Memory ---
    print("\n--- Thread B: Checking Memory ---")
    thread_b = str(uuid.uuid4())
    inputs_b = {
        "thread_id": thread_b,
        "user_id": user_id,
        "approval_question": "What do I like?" # Should trigger memory retrieval
    }
    
    # 3. Start Flow B
    res_b = await human_approval.run({}, {}, inputs_b, blackboard, mock_emit)
    
    if res_b['status'] == "INTERRUPTED":
        payload = res_b.get("interrupt_payload", {})
        # Our updated Code puts "question" + context in payload
        # Wait, interrupt_payload in our invoker is the 'question' string or dict?
        # Let's inspect the output. Ideally we see "Known Memories: ['I like robots']" in the question.
        
        final_output = res_b.get("final_output", "")
        if "I like robots" in final_output:
             print("SUCCESS: Memory 'I like robots' found in Thread B!")
        else:
             print(f"FAIL: Memory not found. Output: {final_output}")
    else:
        print("FAIL: Thread B did not interrupt as expected.")

if __name__ == "__main__":
    asyncio.run(run_scenario())
