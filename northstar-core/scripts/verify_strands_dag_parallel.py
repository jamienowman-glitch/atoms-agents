import asyncio
import sys
import os

# Add repo root to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.core.blackboard import Blackboard
from runtime.strands.modes import dag_parallel

async def run_scenario():
    print("--- SCENARIO: Strands DAG Parallel ---")
    blackboard = Blackboard()
    async def mock_emit(t, m): print(f"[STRANDS] {t}")
    
    inputs = {"branches": ["Branch A", "Branch B", "Branch C"]}
    
    # Each branch takes 0.2s.
    # Sequential ~ 0.6s
    # Parallel ~ 0.2s (+)
    
    res = await dag_parallel.run({}, {}, inputs, blackboard, mock_emit)
    
    print(f"\nResult: {res}")
    
    duration = res.get("duration", 1.0)
    
    if res["status"] == "PASS" and duration < 0.35:
        print(f"SUCCESS: Strands DAG Mode executed 3 branches in {duration:.3f}s (Parallel confirmed).")
    else:
        print(f"FAIL: Execution took {duration:.3f}s, expected < 0.35s for parallel.")

if __name__ == "__main__":
    asyncio.run(run_scenario())
