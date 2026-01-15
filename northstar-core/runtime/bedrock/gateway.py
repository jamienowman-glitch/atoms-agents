from typing import List, Dict, Any
import asyncio
import uuid
from src.core.model_gateway import ModelGateway, ChatMessage, ChatResult
from runtime.bedrock.client import run_bedrock
from runtime.bedrock.types import BedrockRequest

class BedrockGateway:
    """
    Concrete implementation of ModelGateway for AWS Bedrock.
    """
    def __init__(self, tenant_id: str = "test", default_model: str = "amazon.nova-2-lite-v1:0"):
        self.tenant_id = tenant_id
        self.default_model = default_model

    def chat_sync(self, messages: List[ChatMessage], system: str = None, **kwargs) -> ChatResult:
        # Convert Agnostic Messages to Bedrock Format
        # Bedrock 'converse' API handles messages list properly, 
        # but `run_bedrock` wrappers currently simplify to single string or list.
        # We'll construct a prompt for now or use the client's internal conversion.
        
        # Simple Prompt Construction (preserving history)
        prompt_parts = []
        if system:
            prompt_parts.append(f"System: {system}")
        
        for m in messages:
            prompt_parts.append(f"{m.role}: {m.content}")
            
        full_text = "\n".join(prompt_parts)
        
        # Determine Model
        model_id = kwargs.get("model_id", self.default_model)
        
        req = BedrockRequest(
            model_id=model_id,
            user_message=full_text,
            tenant_id=self.tenant_id,
            surface_id="gateway",
            session_id=str(uuid.uuid4())
        )
        
        resp = run_bedrock(req)
        
        # Extract content
        content = resp.messages[0].content
        
        # Extract metadata from raw if available
        # AWS Converse API response structure: 'usage', 'metrics'
        usage_data = resp.raw.get("usage", {})
        
        return ChatResult(
            content=content,
            model_id=kwargs.get("model_id", "unknown"), # Bedrock response raw might not echo model ID in all cases
            usage={
                "input_tokens": usage_data.get("inputTokens", 0),
                "output_tokens": usage_data.get("outputTokens", 0)
            }
        )

    async def chat(self, messages: List[ChatMessage], system: str = None, **kwargs) -> ChatResult:
        loop = asyncio.get_running_loop()
        return await loop.run_in_executor(None, lambda: self.chat_sync(messages, system, **kwargs))
