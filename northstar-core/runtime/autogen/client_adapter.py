from typing import Dict, Any, List
from autogen_core.models import CreateResult, RequestUsage
from src.core.model_gateway import ModelGateway, ChatMessage
import asyncio

class AgnosticModelClient:
    """
    Adapts Northstar ModelGateway to AutoGen's ModelClient protocol.
    Zero references to Bedrock or Boto3.
    """
    def __init__(self, gateway: ModelGateway, model_name: str):
        self.gateway = gateway
        self.model_name = model_name

    async def create(self, messages, **kwargs):
        # Convert AutoGen messages to Agnostic ChatMessage
        agnostic_msgs = []
        system = None
        
        for m in messages:
            content = getattr(m, 'content', str(m))
            role = getattr(m, 'source', 'user')
            if role == 'system':
                system = content # basic handling, might overwrite
            else:
                agnostic_msgs.append(ChatMessage(role=role, content=content))
        
        # Delegate to Gateway
        result = await self.gateway.chat(agnostic_msgs, system=system, model_id=self.model_name)
        
        return CreateResult(
            content=result.content,
            usage=RequestUsage(prompt_tokens=0, completion_tokens=0),
            finish_reason="stop",
            cached=False
        )

    @property
    def model_info(self):
        return {"vision": False, "function_calling": False, "json_output": False, "family": "agnostic"}
