from runtime.bedrock.types import BedrockRequest, BedrockResponse
from runtime.bedrock.client import run_bedrock
from typing import Dict, Optional

def run(
    *,
    tenant_id: str,
    surface_id: str,
    model_id: str,
    session_id: str,
    user_message: str,
    context: Optional[Dict] = None,
) -> Dict:
    """
    Thin shim for Roots Manuva to call the AWS Bedrock runtime.
    
    Args:
        tenant_id: The tenant identity.
        surface_id: The surface calling this agent.
        model_id: The Bedrock model ID.
        session_id: Defines the conversation session.
        user_message: The message from the user.
        context: Optional extra context.
        
    Returns:
        A dict representation of the response (BedrockResponse).
    """
    req = BedrockRequest(
        tenant_id=tenant_id,
        surface_id=surface_id,
        model_id=model_id,
        session_id=session_id,
        user_message=user_message,
        context=context,
    )
    
    resp: BedrockResponse = run_bedrock(req)
    
    # Return serializable dict for downstream consumers
    return resp.model_dump()
