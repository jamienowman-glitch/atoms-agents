from typing import Dict, Any, AsyncGenerator, Optional
import os
from openai import AsyncOpenAI
from northstar.runtime.gateway import GatewayProvider, ReadinessCheck
from northstar.registry.schemas import ModelCard
from northstar.runtime.limits import RunLimits
from northstar.runtime.context import AgentsRequestContext

class MolmoProvider(GatewayProvider):
    """
    Molmo 2 Provider via OpenRouter.
    Unlocks "The Eye" of the system: Pointing, Bounding Boxes, and Counting.
    """
    
    # OpenRouter Model ID (Verified Free Tier)
    MODEL_ID = "allenai/molmo-2-8b:free"
    
    def __init__(self, provider_id: str):
        self.provider_id = provider_id
        self.api_key = os.getenv("OPENROUTER_API_KEY")
        self.base_url = "https://openrouter.ai/api/v1"
        self.client: Optional[AsyncOpenAI] = None

    def check_readiness(self) -> ReadinessCheck:
        if not self.api_key:
            return ReadinessCheck(ready=False, reason="OPENROUTER_API_KEY env var missing")
        
        # Lazy Init
        if not self.client:
            self.client = AsyncOpenAI(
                api_key=self.api_key, 
                base_url=self.base_url,
                # OpenRouter required headers
                default_headers={
                    "HTTP-Referer": "https://northstar.agent", 
                    "X-Title": "Northstar Agents"
                }
            )
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
        
        if not self.client:
            raise RuntimeError("Molmo Provider not initialized")

        # --- CAPABILITY TOGGLES ---
        # 1. Pointing: Molmo native capability via prompt "<point>"
        # 2. Bounding Boxes: Molmo native capability via prompt "<box>"
        # We don't need to change the API call, just ensure the prompt is passed correctly.
        
        # OpenRouter Spec for Multimodal:
        # Pass image URLs as content: [{type: text, text: ...}, {type: image_url, image_url: ...}]
        # This provider assumes 'messages' are already formatted correctly by the Composer layer.
        
        try:
            stream = await self.client.chat.completions.create(
                model=self.MODEL_ID, # Enforce the free 8B model or use model.model_id
                messages=messages,
                stream=True,
                max_tokens=limits.max_output_tokens or 2048,
                temperature=0.1 # Low temp for precision pointing
            )

            async for chunk in stream:
                delta = chunk.choices[0].delta
                if delta.content:
                    # Pass-through XML tags like <point x="500">
                    yield {"type": "content_delta", "content": delta.content}
                    
        except Exception as e:
            yield {"type": "error", "error": str(e)}
