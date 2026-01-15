"""
Bedrock Standard Runtime Adapter.
Thin wrapper for Amazon Bedrock Foundation Models.
"""
from typing import Any, Dict, AsyncIterator
from runtime.contract import RuntimeAdapter, StreamChunk
from .client import run_bedrock, run_bedrock_stream
from .types import BedrockRequest

class BedrockAdapter:
    """
    Adapter for Amazon Bedrock runtime.
    """
    
    def invoke(
        self, 
        card_id: str, 
        input_data: Dict[str, Any], 
        context: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Invokes a Bedrock model.
        
        Args:
            card_id: Model ID (e.g., 'us.amazon.nova-2-lite-v1:0').
            input_data: Input dictionary.
            context: Context.
        """
        if "tenant_id" not in context:
            raise ValueError("Missing required context: tenant_id")
        
        if isinstance(input_data, dict):
            user_msg = input_data.get("input", "") or str(input_data)
        else:
            user_msg = str(input_data)
        
        req = BedrockRequest(
            model_id=card_id,
            user_message=user_msg,
            tenant_id=context["tenant_id"],
            surface_id=context.get("surface_id", "unknown"),
            session_id=context.get("session_id", "default"),
            context=context
        )
        
        response = run_bedrock(req)
        
        return {
            "status": "invoked", 
            "runtime": "bedrock",
            "card_id": card_id,
            "response": response.messages[0].content,
            "raw": response.raw
        }

    async def invoke_stream(
        self,
        card_id: str,
        input_data: Dict[str, Any],
        context: Dict[str, Any]
    ) -> AsyncIterator[StreamChunk]:
        """
        Streams a Bedrock model response.
        """
        if "tenant_id" not in context:
            raise ValueError("Missing required context: tenant_id")

        user_msg = input_data.get("input", "") or str(input_data)
        
        req = BedrockRequest(
            model_id=card_id,
            user_message=user_msg,
            tenant_id=context["tenant_id"],
            surface_id=context.get("surface_id", "unknown"),
            session_id=context.get("session_id", "default"),
            context=context
        )
        
        async for chunk in run_bedrock_stream(req):
            yield chunk
