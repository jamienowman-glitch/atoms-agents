from typing import Dict, Any, Callable, Awaitable
from src.core.blackboard import Blackboard
import traceback
import asyncio
import time

async def run(
    mode_card: Dict[str, Any],
    flow_card: Dict[str, Any],
    inputs: Dict[str, Any],
    blackboard: Blackboard,
    emit: Callable[[str, Dict[str, Any]], Awaitable[None]]
) -> Dict[str, Any]:
    """
    Executes Strands DAG Parallel Mode.
    Executes branches concurrently.
    """
    try:
        branches = inputs.get("branches", ["Branch A", "Branch B"])
        
        await emit(f"Initializing Strands DAG with {len(branches)} parallel branches.", {"event_type": "info"})
        
        async def run_branch(name: str):
            await emit(f"Started Branch: {name}", {"event_type": "branch_start", "branch": name})
            # Simulate work (all branches take same time)
            await asyncio.sleep(0.2) 
            await emit(f"Completed Branch: {name}", {"event_type": "branch_end", "branch": name})
            return f"Result({name})"

        start_time = time.time()
        
        # Parallel Execution
        results = await asyncio.gather(*(run_branch(b) for b in branches))
        
        duration = time.time() - start_time
        
        await emit(f"DAG Execution Complete in {duration:.2f}s.", {"event_type": "success"})
        
        return {
            "status": "PASS", 
            "results": list(results),
            "duration": duration,
            "branch_count": len(branches)
        }

    except Exception as e:
        traceback.print_exc()
        return {"status": "FAIL", "reason": str(e)}
