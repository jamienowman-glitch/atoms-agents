import asyncio
import sys
import os
import argparse

# Add repo root to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.core.blackboard import Blackboard
from runtime.langgraph.modes import human_approval

async def run_setup():
    print("--- STEP 1: SETUP (Start Flow & Exit) ---")
    blackboard = Blackboard()
    async def mock_emit(t, m): print(f"[EMIT] {t}")
    
    inputs = {"approval_question": "Durable Checkpoint Test?"}
    res = await human_approval.run({}, {}, inputs, blackboard, mock_emit)
    
    if res['status'] == "INTERRUPTED":
        print(f"SUCCESS: Interrupted. Thread ID: {res['thread_id']}")
        # Save ID to temp file for step 2 to read easily in test automation
        with open("durability_thread.txt", "w") as f:
            f.write(res['thread_id'])
    else:
        print(f"FAIL: Expected INTERRUPTED, got {res['status']}")

async def run_resume():
    print("--- STEP 2: RESUME (Load from Disk) ---")
    if not os.path.exists("durability_thread.txt"):
        print("FAIL: No thread ID file found. Run setup first.")
        return

    with open("durability_thread.txt", "r") as f:
        thread_id = f.read().strip()
    
    print(f"Resuming Thread: {thread_id}")
    
    blackboard = Blackboard()
    async def mock_emit(t, m): print(f"[EMIT] {t}")
    
    inputs = {"thread_id": thread_id, "resume_action": "approve"}
    res = await human_approval.run({}, {}, inputs, blackboard, mock_emit)
    
    if res['status'] == "PASS" and "authorized" in res['final_output'].lower():
        print("SUCCESS: Durable Resume Verified.")
    else:
        print(f"FAIL: Resume failed. Status: {res['status']}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("mode", choices=["setup", "resume"])
    args = parser.parse_args()
    
    if args.mode == "setup":
        asyncio.run(run_setup())
    elif args.mode == "resume":
        asyncio.run(run_resume())
