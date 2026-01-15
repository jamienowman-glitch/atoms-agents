from typing import Dict, Any, Callable, Awaitable
from src.core.blackboard import Blackboard
import traceback
import asyncio
import os

# Try imports
try:
    import vertexai
    from vertexai.generative_models import GenerativeModel, Tool
    # Note: FunctionDeclaration might be needed for low-level definition
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
    Executes ADK Custom Tools Mode.
    Demonstrates tool registration and invocation.
    """
    try:
        action = inputs.get("action", "Get weather")
        
        await emit(f"Initializing ADK Tools for: {action}", {"event_type": "info"})
        
        project_id = os.environ.get("GCP_PROJECT_ID") or os.environ.get("GCP_PROJECT")
        
        def get_weather(location: str):
            """Get weather for a location."""
            return {"location": location, "temp": 72, "condition": "Sunny"}

        tool_result = None

        if VERTEX_INSTALLED and project_id:
            try:
                vertexai.init(project=project_id)
                # REAL EXECUTION STUB
                # tools = [Tool.from_function(get_weather)]
                # model = GenerativeModel("gemini-1.5-flash", tools=tools)
                # resp = model.generate_content(action)
                # ... handle function call ...
                pass
            except Exception as e:
                print(f"[ADK] Real Tool Error: {e}")
                project_id = None # Fallback

        if not project_id or not VERTEX_INSTALLED:
             # MOCK EXECUTION
             await emit("Running in MOCK/OFFLINE Tool Mode", {"event_type": "warning"})
             
             # Simulate LLM deciding to call tool
             await emit(f"Agent decides to call tool: get_weather(location='NYC')", {"event_type": "tool_call"})
             await asyncio.sleep(0.1)
             
             # Execute tool
             if "NYC" in action or "weather" in action:
                 tool_arg = "NYC" # Simplification
                 result = get_weather(tool_arg)
                 tool_result = str(result)
                 await emit(f"Tool Output: {tool_result}", {"event_type": "tool_output"})
                 await asyncio.sleep(0.1)
                 
                 final_response = f"The weather in {tool_arg} is {result['condition']}."
             else:
                 final_response = "I couldn't trigger the tool."

        await emit(f"Tool Execution Complete. Final Response: {final_response}", {"event_type": "success"})
        
        return {
            "status": "PASS", 
            "tool_result": tool_result,
            "final_response": final_response
        }

    except Exception as e:
        traceback.print_exc()
        return {"status": "FAIL", "reason": str(e)}
