from typing import Dict, Any, Callable, Awaitable
from src.core.blackboard import Blackboard
import traceback
import asyncio
from pydantic import BaseModel

try:
    from crewai.flow.flow import Flow, listen, start, router, or_
    CREWAI_INSTALLED = True
except ImportError:
    CREWAI_INSTALLED = False

class RouterState(BaseModel):
    success_flag: bool = False
    path_taken: str = ""
    final_message: str = ""

if CREWAI_INSTALLED:
    class RouterFlow(Flow[RouterState]):
        
        def __init__(self, success_flag: bool = True):
            super().__init__()
            self._initial_success = success_flag

        @start()
        def start_method(self):
            print(f"[Flow] Starting. Outcome set to: {'Success' if self._initial_success else 'Fail'}")
            self.state.success_flag = self._initial_success
            # We return the state or something to satisfy start if needed, 
            # but router listens to this method.

        @router(start_method)
        def route_logic(self):
            # Returns the route name as string
            if self.state.success_flag:
                return "success_route"
            else:
                return "fail_route"

        @listen("success_route")
        def success_handler(self):
            print("[Flow] Executing Success Handler")
            self.state.path_taken = "success"
            return "Success Handler Done"

        @listen("fail_route")
        def fail_handler(self):
            print("[Flow] Executing Fail Handler")
            self.state.path_taken = "fail"
            return "Fail Handler Done"

        @listen(or_(success_handler, fail_handler))
        def finalizer(self, result):
            # 'result' comes from whichever executed
            print(f"[Flow] Finalizing. Previous result: {result}")
            self.state.final_message = f"Finalized after {self.state.path_taken}"
            return self.state.final_message

async def run(
    mode_card: Dict[str, Any],
    flow_card: Dict[str, Any],
    inputs: Dict[str, Any],
    blackboard: Blackboard,
    emit: Callable[[str, Dict[str, Any]], Awaitable[None]]
) -> Dict[str, Any]:
    """
    Executes CrewAI Router Mode.
    Demonstrates @router and or_ logic.
    """
    if not CREWAI_INSTALLED:
        return {"status": "FAIL", "reason": "CrewAI not installed"}

    try:
        outcome_input = inputs.get("outcome", "success")
        is_success = (outcome_input.lower() == "success")
        
        flow = RouterFlow(success_flag=is_success)
        
        await emit(f"Starting Router Flow with outcome={outcome_input}", {"event_type": "info"})
        
        # Async kickoff
        result = await flow.kickoff_async()
        
        final_state = {
            "id": flow.state.id if hasattr(flow.state, "id") else "unknown",
            "path_taken": flow.state.path_taken,
            "final_message": flow.state.final_message
        }
        
        await emit(f"Flow Complete. Path: {flow.state.path_taken}", {"event_type": "success", "state": final_state})
        
        return {"status": "PASS", "final_output": result, "state": final_state}

    except Exception as e:
        traceback.print_exc()
        return {"status": "FAIL", "reason": str(e)}
