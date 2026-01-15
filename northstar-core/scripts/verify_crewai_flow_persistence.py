import asyncio
import sys
import os

# Add repo root to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.core.blackboard import Blackboard
from runtime.crewai.modes import flow_persistence

async def run_scenario():
    print("--- SCENARIO: CrewAI Flow Persistence ---")
    blackboard = Blackboard()
    async def mock_emit(t, m): print(f"[AGENT] {t}")
    
    print("\n--- RUN 1 (Reset) ---")
    inputs_1 = {"reset": True}
    res_1 = await flow_persistence.run({}, {}, inputs_1, blackboard, mock_emit)
    print(f"Result 1: {res_1}")

    if res_1.get("status") != "PASS":
        print("Run 1 FAILED.")
        return

    c1 = res_1["state"]["counter"]
    id1 = res_1["state"]["id"]
    print(f"Run 1 Counter: {c1} (ID: {id1})")
    
    print("\n--- RUN 2 (Resume) ---")
    inputs_2 = {"reset": False, "resume_flow_id": id1}
    # We suspect this might Create New unless we do something special
    res_2 = await flow_persistence.run({}, {}, inputs_2, blackboard, mock_emit)
    c2 = res_2["state"]["counter"]
    id2 = res_2["state"]["id"]
    print(f"Run 2 Counter: {c2} (ID: {id2})")
    
    if c1 == 1 and c2 > 1 and id1 == id2:
        print("SUCCESS: Counter incremented on SAME flow ID (Auto-Resume).")
    elif c1 == 1 and c2 > 1 and id1 != id2:
        print("PARTIAL SUCCESS: Counter incremented but ID changed (Logic persisted, state copied?).")
    elif c1 == 1 and c2 == 1:
        print("FAIL: Counter did not increment (New State Created).")
        print("NOTE: This is ensuring persistence works across process (simulated).")

if __name__ == "__main__":
    asyncio.run(run_scenario())
