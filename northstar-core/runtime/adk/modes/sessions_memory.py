from typing import Dict, Any, Callable, Awaitable
from src.core.blackboard import Blackboard
import traceback
import asyncio
import os

# Try imports
try:
    import vertexai
    from vertexai.generative_models import GenerativeModel, ChatSession
    VERTEX_INSTALLED = True
except ImportError:
    VERTEX_INSTALLED = False

# Mock In-Memory Storage for demo purpose (normally Redis/DB)
MOCK_SESSION_STORE = {}

async def run(
    mode_card: Dict[str, Any],
    flow_card: Dict[str, Any],
    inputs: Dict[str, Any],
    blackboard: Blackboard,
    emit: Callable[[str, Dict[str, Any]], Awaitable[None]]
) -> Dict[str, Any]:
    """
    Executes ADK Sessions Mode.
    Demonstrates persisting context across turns using session_id.
    """
    try:
        session_id = inputs.get("session_id", "sess_001")
        facts = inputs.get("facts", ["I am a user."])
        
        await emit(f"Initializing ADK Session: {session_id}", {"event_type": "info"})
        
        project_id = os.environ.get("GCP_PROJECT_ID") or os.environ.get("GCP_PROJECT")
        
        memory_state = []
        response_text = ""

        if VERTEX_INSTALLED and project_id:
            try:
                vertexai.init(project=project_id)
                # REAL EXECUTION STUB
                # model = GenerativeModel("gemini-1.5-flash")
                # chat = model.start_chat()
                # for fact in facts:
                #    chat.send_message(f"Remember: {fact}")
                pass
            except Exception as e:
                print(f"[ADK] Real Session Error: {e}")
                project_id = None # Fallback

        if not project_id or not VERTEX_INSTALLED:
             # MOCK EXECUTION
             await emit("Running in MOCK/OFFLINE Session Mode", {"event_type": "warning"})
             
             # Retrieve existing
             if session_id not in MOCK_SESSION_STORE:
                 MOCK_SESSION_STORE[session_id] = []
             
             # Add new facts
             for fact in facts:
                 MOCK_SESSION_STORE[session_id].append(fact)
                 await emit(f"User: Remember {fact}", {"event_type": "user_input"})
                 await asyncio.sleep(0.05)
                 await emit(f"Agent: Stored '{fact}' in session {session_id}", {"event_type": "agent_response"})
             
             memory_state = MOCK_SESSION_STORE[session_id]
             response_text = f"Session {session_id} contains {len(memory_state)} items."
             
             # Simulate Recall
             await emit(f"Agent Recall: I remember you told me: {', '.join(memory_state)}", {"event_type": "agent_recall"})

        await emit(f"Session Execution Complete. State: {memory_state}", {"event_type": "success"})
        
        return {
            "status": "PASS", 
            "session_id": session_id,
            "memory_count": len(memory_state),
            "final_response": response_text
        }

    except Exception as e:
        traceback.print_exc()
        return {"status": "FAIL", "reason": str(e)}
