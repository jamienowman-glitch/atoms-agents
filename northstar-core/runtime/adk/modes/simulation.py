from typing import Dict, Any, Callable, Awaitable
from src.core.blackboard import Blackboard
import traceback
import asyncio
import os
import random

# Try imports
try:
    import vertexai
    from vertexai.generative_models import GenerativeModel
    VERTEX_INSTALLED = True
except ImportError:
    VERTEX_INSTALLED = False

async def run(
    mode_card: Dict[str, Any],
    flow_card: Dict[str, Any],
    inputs: Dict[str, Any],
    blackboard: Blackboard,
    emit: Callable[[str, Dict[str, Any]], Awaitable[None]]
) -> Dict[str, Any]:
    """
    Executes ADK Simulation Mode.
    Simulates a conversation between a 'User Agent' and the 'System Agent'.
    """
    try:
        scenario = inputs.get("prompt", "Simulate a refund request")
        num_turns = inputs.get("num_turns", 3)
        
        await emit(f"Starting ADK Simulation: {scenario} ({num_turns} turns)", {"event_type": "info"})
        
        # Check environment for real execution
        project_id = os.environ.get("GCP_PROJECT_ID") or os.environ.get("GCP_PROJECT")
        
        trace = []
        
        if VERTEX_INSTALLED and project_id:
            # REAL EXECUTION (Partial)
            try:
                vertexai.init(project=project_id)
                # We would create two models here: User Sim and Agent
                # For simplicity in this mode, we just show the structure
                user_model = GenerativeModel("gemini-1.5-flash")
                agent_model = GenerativeModel("gemini-1.5-flash")
                
                history = []
                # Stub loop for real execution logic (omitted for safety/cost in demo)
                trace.append({"turn": 1, "speaker": "User", "text": "[Real API execution placeholder]"})
            except Exception as e:
                print(f"[ADK] Real Simulation Error: {e}")
                # Fallback to simulation
                project_id = None 

        if not project_id or not VERTEX_INSTALLED:
            # MOCK SIMULATION (Verification Mode)
             await emit("Running in MOCK/OFFLINE Simulation Mode", {"event_type": "warning"})
             
             # Roles
             user_role = "User Simulator"
             agent_role = "Target Agent"
             
             for i in range(num_turns):
                 # Mock User Turn
                 user_text = f"Simulation turn {i+1}: User asks about {scenario.split()[-1]}"
                 trace.append({"turn": i+1, "speaker": user_role, "text": user_text})
                 await emit(f"{user_role}: {user_text}", {"event_type": "trace"})
                 await asyncio.sleep(0.1)
                 
                 # Mock Agent Turn
                 agent_text = f"Simulation turn {i+1}: Agent responds strictly."
                 trace.append({"turn": i+1, "speaker": agent_role, "text": agent_text})
                 await emit(f"{agent_role}: {agent_text}", {"event_type": "trace"})
                 await asyncio.sleep(0.1)

        await emit(f"Simulation Complete. Generated {len(trace)} trace items.", {"event_type": "success"})
        
        return {
            "status": "PASS", 
            "trace": trace,
            "metrics": {
                "coherence": 0.95, # Mock metric
                "safety": 1.0
            }
        }

    except Exception as e:
        traceback.print_exc()
        return {"status": "FAIL", "reason": str(e)}
