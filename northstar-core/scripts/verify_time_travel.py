import asyncio
import sys
import os
import uuid
import aiosqlite
from langgraph.checkpoint.sqlite.aio import AsyncSqliteSaver

# Add repo root to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from runtime.langgraph.modes import human_approval

async def run_scenario():
    print("--- SCENARIO: Time Travel (State Forking) ---")
    
    # 1. Setup Shared DB Connection
    DB_PATH = "northstar_state.db"
    conn = await aiosqlite.connect(DB_PATH)
    checkpointer = AsyncSqliteSaver(conn)
    await checkpointer.setup()
    
    # 2. Create the Graph App
    # We pass checkpointer. Store is optional (None).
    app = human_approval.create_app(checkpointer=checkpointer, store=None)
    
    # 3. Start Flow (Original Path)
    thread_id = str(uuid.uuid4())
    inputs_original = {
        "approval_question": "Original Question: Do you approve?",
        "user_id": "traveler"
    }
    
    config = {
        "configurable": {
            "thread_id": thread_id,
            "user_inputs": inputs_original
        }
    }
    
    print(f"\n[1] Starting Flow {thread_id} with Original Question...")
    current_state = {"status": "pending", "feedback": ""}
    # Using ainvoke directly on app
    await app.ainvoke(current_state, config=config)
    
    # Check interrupt
    snapshot = await app.aget_state(config)
    tasks = snapshot.tasks
    interrupt_info = tasks[0].interrupts[0].value
    print(f"Interrupt Received: {interrupt_info}")
    
    if "Original Question" not in str(interrupt_info):
        print("FAIL: Original question not found.")
        return

    # 4. Get History / Checkpoint
    print(f"\n[2] Fetching History...")
    # snapshots = [s async for s in app.aget_state_history(config)] # async iterator
    # Note: aget_state_history returns async iterator
    history = []
    async for snap in app.aget_state_history(config):
        history.append(snap)
    
    # The most recent is at index 0 (the interrupt). 
    # The one BEFORE that is the step before interrupt? 
    # Actually, we want to fork from the existing structure.
    # If we want to CHANGE the question, we need to re-run the node with new config?
    # Or update the state?
    # The question is read from `config`. If we change `config` and resume/replay?
    
    latest_checkpoint_id = snapshot.config["configurable"]["checkpoint_id"]
    print(f"Latest Checkpoint: {latest_checkpoint_id}")

    # 5. Fork / Replay with NEW Config (Time Travel)
    # We want to restart from the beginning (or specific point) with NEW inputs.
    # But wait, "Time Travel" usually means updating STATE.
    # Our `action_node` reads from `config.user_inputs`.
    # If we invoke with `checkpoint_id` (Time Travel) AND updated `user_inputs` in config,
    # does it re-execute the node?
    # If the node was already executed, LangGraph might skip it unless we force it.
    # But `action_node` produced the interrupt. If we resume, we continue.
    # If we want to RE-RUN `action_node` with new inputs, we might need to go back to the checkpoint BEFORE `action_node`.
    
    # Let's find the start checkpoint (empty state or input state).
    # history[-1] is usually start.
    
    print("\n[3] Forking with NEW Question (Time Travel)...")
    inputs_fork = {
        "approval_question": "FORKED Question: Are you sure?",
        "user_id": "traveler"
    }
    
    # We will invoke passing the SAME thread_id (so it's same thread) 
    # but we might need to target a previous point?
    # Currently we are AT the interrupt. "action_node" has run.
    # If we run again with new config, does it re-run action_node?
    # If we just call `ainvoke` with new inputs, it might try to "resume" if we don't specify inputs?
    # Let's try invoking from START (effectively restarting thread with new inputs?) 
    # No that's not time travel, that's just a new run.
    
    # Time Travel: Update State.
    # Let's try `update_state` to change a state field, forcing a new checkpoint, then run.
    # We can update `status` to "forking".
    
    fork_config = await app.aupdate_state(config, {"status": "forking"})
    # This creates a new checkpoint.
    
    # Now invoke with this new config AND new user_inputs
    fork_config["configurable"]["user_inputs"] = inputs_fork
    
    # We need to trigger the node execution.
    # effectively "resuming" from the fork.
    # Since we are at the interrupt node 'decision_point', does it re-run?
    # LangGraph re-runs if inputs provided or state changed?
    
    print(f"Fork Config: {fork_config}")
    
    # Invoke
    # passing None as input assumes we continue?
    await app.ainvoke(None, config=fork_config)
    
    # Check Result
    snapshot_fork = await app.aget_state(fork_config) # Use fork config which has thread_id
    # Wait, 'fork_config' has specific checkpoint_id? 
    # If we ran, we are at a NEW checkpoint (the result of the run). 
    # We should query by thread_id to get latest.
    
    config_latest = {"configurable": {"thread_id": thread_id}}
    snapshot_latest = await app.aget_state(config_latest)
    
    tasks = snapshot_latest.tasks
    if not tasks: 
         print(f"FAIL: No tasks found. Status: {snapshot_latest.values}")
         await conn.close()
         return

    interrupt_info_fork = tasks[0].interrupts[0].value
    print(f"Forked Interrupt Received: {interrupt_info_fork}")
    
    if "FORKED Question" in str(interrupt_info_fork):
        print("SUCCESS: Forked Question found in Time Travel!")
    else:
        print("FAIL: Forked Question NOT found. Still seeing old question?")

    await conn.close()

if __name__ == "__main__":
    asyncio.run(run_scenario())
