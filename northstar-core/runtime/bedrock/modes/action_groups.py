from typing import Dict, Any, Callable, Awaitable
from src.core.blackboard import Blackboard
import traceback
import asyncio
import os

# Try imports
try:
    import boto3
    BOTO3_INSTALLED = True
except ImportError:
    BOTO3_INSTALLED = False

async def run(
    mode_card: Dict[str, Any],
    flow_card: Dict[str, Any],
    inputs: Dict[str, Any],
    blackboard: Blackboard,
    emit: Callable[[str, Dict[str, Any]], Awaitable[None]]
) -> Dict[str, Any]:
    """
    Executes Bedrock Action Groups Mode.
    Simulates an Agent deciding to call an Action Group.
    """
    try:
        action = inputs.get("action", "Check status")
        
        await emit(f"Initializing Bedrock Action Group flow for: {action}", {"event_type": "info"})
        
        aws_access_key = os.environ.get("AWS_ACCESS_KEY_ID")
        run_real = BOTO3_INSTALLED and aws_access_key and "MOCK" not in action
        
        trace = []
        final_result = ""

        if run_real:
            # In a real scenario, this involves defining an Agent with an Action Group,
            # then invoking it. The runtime here acts as the 'Client' invoking the agent.
            # The 'Action Group' logic (Lambda) is usually external.
            # We will default to mock for this demo mode unless specifically wired.
             run_real = False

        if not run_real:
             # MOCK EXECUTION
             await emit("Running in MOCK/OFFLINE Action Group Mode", {"event_type": "warning"})
             
             # 1. Agent Reasoning - Pre-computation
             await asyncio.sleep(0.1)
             await emit("Agent reasoning: User wants to check order status.", {"event_type": "trace", "step": "REASONING"})
             
             # 2. Agent invocation of Action Group
             await asyncio.sleep(0.1)
             await emit("Agent invoking ActionGroup: OrderService::GetStatus(id=123)", {"event_type": "trace", "step": "ACTION_INVOCATION"})
             
             # 3. Action Group Execution (Simulated Lambda)
             trace.append({"step": "ActionGroup", "input": "GetStatus(123)", "output": "Status: Shipped"})
             await emit("ActionGroup execution success. Output: {Status: Shipped}", {"event_type": "trace", "step": "ACTION_RESULT"})
             
             # 4. Final Response
             final_result = "Your order #123 has been Shipped."
             await emit(f"Agent Response: {final_result}", {"event_type": "response"})

        await emit(f"Action Group Flow Complete.", {"event_type": "success"})
        
        return {
            "status": "PASS", 
            "final_result": final_result,
            "action_trace": trace
        }

    except Exception as e:
        traceback.print_exc()
        return {"status": "FAIL", "reason": str(e)}
