from typing import Dict, Any, AsyncGenerator, Optional
import os
from northstar.runtime.gateway import GatewayProvider, ReadinessCheck
from northstar.registry.schemas import ModelCard
from northstar.runtime.limits import RunLimits
from northstar.runtime.context import AgentsRequestContext

class MistralProvider(GatewayProvider):
    def __init__(self, provider_id: str):
        self.provider_id = provider_id
        self.api_key = os.getenv("MISTRAL_API_KEY")
        self.base_url = "https://api.mistral.ai/v1"
        self._client = None

    def check_readiness(self) -> ReadinessCheck:
        if not self.api_key:
            return ReadinessCheck(ready=False, reason="MISTRAL_API_KEY missing")
        return ReadinessCheck(ready=True)

    async def generate_stream(
        self,
        messages: list[Dict[str, Any]],
        model: ModelCard,
        run_config: Any,
        capability_toggles: list,
        limits: RunLimits,
        request_context: Optional[AgentsRequestContext] = None
    ) -> AsyncGenerator[Dict[str, Any], None]:
        
        # Lazy load client
        try:
             from mistralai import Mistral
             if not self._client:
                 self._client = Mistral(api_key=self.api_key)
        except ImportError:
             raise RuntimeError("mistralai lib not installed")
             
        # Map capabilities to tool_choice
        tool_choice = "auto"
        # If user requests explicit tool usage
        # This implementation assumes tools are passed in run_config or appended to messages
        
        try:
            resp = await self._client.chat.complete_async(
                model=model.model_id, # "mistral-small-latest"
                messages=messages,
                # tools=...
                # tool_choice=tool_choice
            )
            
            # Streaming not implemented in this starter stub, yielding full response
            content = resp.choices[0].message.content
            yield {"type": "content_delta", "content": content}
            
        except Exception as e:
            yield {"type": "error", "error": str(e)}
