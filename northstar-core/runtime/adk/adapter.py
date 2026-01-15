"""
ADK Runtime Adapter.
Thin wrapper for ADK (Vertex Agent) runtime.
"""
import os
from typing import Any, Dict, AsyncIterator
from runtime.contract import RuntimeAdapter
# Assuming client.py exists and handles the actual ADK connection details
# from .client import run_adk_agent 

class ADKAdapter:
    """
    Adapter for ADK (Vertex Agent) runtime.
    """
    
    def invoke(
        self, 
        card_id: str, 
        input_data: Dict[str, Any], 
        context: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Invokes an ADK agent.
        
        Args:
            card_id: Reference to the Card (maps to Agent definition).
            input_data: Input dictionary.
            context: Context containing tenant_id, env, etc.
        """
         # Validation checks
        if "tenant_id" not in context:
            raise ValueError("Missing required context: tenant_id")
        if "env" not in context:
            raise ValueError("Missing required context: env")
            
        # Helper to ensure specific env vars are present if needed by client
        if "GCP_PROJECT_ID" not in os.environ and "GCP_PROJECT" not in os.environ:
             # Just a check, strictly speaking env vars should be managed outside, 
             # but good to fail fast if runtime expects them.
             pass

        # TODO: Wire to actual client.run_adk_agent(card_id, input_data, ...)
        # return run_adk_agent(...)
        
        return {
            "status": "invoked", 
            "runtime": "adk",
            "card_id": card_id,
            "mock_result": True
        }

    async def invoke_stream(
        self,
        card_id: str,
        input_data: Dict[str, Any],
        context: Dict[str, Any]
    ) -> AsyncIterator["StreamChunk"]: # Forward ref or imported from contract
        """
        Invokes an ADK agent with streaming.
        """
        # Validation checks
        if "tenant_id" not in context:
            raise ValueError("Missing required context: tenant_id")
        if "env" not in context:
            raise ValueError("Missing required context: env")

        # Map input to AdkAgentRequest
        # Assuming minimal mapping for now as per invoke()
        from .types import AdkAgentRequest
        # from .client import run_adk_agent_stream # deferred import to avoid circular dep if any

        # Use logic similar to what should be in invoke() for mapping
        user_msg = input_data.get("input", "") or str(input_data)
        
        req = AdkAgentRequest(
            agent_id=card_id,
            user_message=user_msg,
            session_id=context.get("session_id")
        )

        from .client import run_adk_agent_stream
        from runtime.contract import StreamChunk
        
        async for chunk in run_adk_agent_stream(req):
            yield chunk
