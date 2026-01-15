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
    Executes Strands Linear Sequence Mode.
    Iterates through steps, simulating execution time and emitting events.
    """
    try:
        steps = inputs.get("steps", ["Step 1", "Step 2"])
        
        await emit(f"Initializing Strands Linear Sequence with {len(steps)} steps.", {"event_type": "info"})
        
        execution_log = []
        
        for i, step_name in enumerate(steps):
            start_time = time.time()
            
            # Emit Start Event
            await emit(f"Starting Step {i+1}: {step_name}", {"event_type": "step_start", "step": step_name})
            
            # Simulate 'Work'
            await asyncio.sleep(0.1) # 100ms work simulation
            
            # Record execution
            duration = time.time() - start_time
            execution_log.append({
                "step": step_name,
                "status": "completed",
                "duration": duration
            })
            
            # Emit End Event
            await emit(f"Completed Step {i+1}: {step_name}", {"event_type": "step_end", "step": step_name})

        await emit(f"Sequence Complete. Executed {len(execution_log)} steps.", {"event_type": "success"})
        
        return {
            "status": "PASS", 
            "execution_log": execution_log,
            "total_steps": len(execution_log)
        }

    except Exception as e:
        traceback.print_exc()
        return {"status": "FAIL", "reason": str(e)}
