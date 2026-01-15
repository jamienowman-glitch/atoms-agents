from runtime.adk.types import AdkAgentRequest, AdkAgentResponse
from runtime.adk.client import run_adk_agent
from typing import Dict, Optional

def run(
    *,
    tenant_id: str,
    surface_id: str,
    agent_id: str,
    session_id: str,
    user_message: str,
    context: Optional[Dict] = None,
) -> Dict:
    """
    Thin shim for Roots Manuva to call the ADK runtime.
    
    Args:
        tenant_id: The tenant identity.
        surface_id: The surface calling this agent.
        agent_id: The ADK agent resource ID (or model ID for v0 stubs).
        session_id: Defines the converastion session.
        user_message: The message from the user.
        context: Optional extra context.
        
    Returns:
        A dict representation of the response (AdkAgentResponse).
    """
    req = AdkAgentRequest(
        tenant_id=tenant_id,
        surface_id=surface_id,
        agent_id=agent_id,
        session_id=session_id,
        user_message=user_message,
        context=context,
    )
    
    resp: AdkAgentResponse = run_adk_agent(req)
    
    # Return serializable dict for downstream consumers
    return resp.model_dump()
