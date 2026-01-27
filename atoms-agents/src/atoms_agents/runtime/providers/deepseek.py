from typing import Dict, Any, AsyncGenerator, Optional
import os
from openai import AsyncOpenAI
from atoms_agents.runtime.gateway import GatewayProvider, ReadinessCheck, GatewayResponse
from atoms_agents.registry.schemas import ModelCard
from atoms_agents.runtime.limits import RunLimits
from atoms_agents.runtime.context import AgentsRequestContext

class DeepSeekProvider(GatewayProvider):
    def __init__(self, provider_id: str):
        self.provider_id = provider_id
        self.api_key = os.getenv("DEEPSEEK_API_KEY")
        self.base_url = "https://api.deepseek.com"
        self.client: Optional[AsyncOpenAI] = None

    def check_readiness(self) -> ReadinessCheck:
        if not self.api_key:
            return ReadinessCheck(ready=False, reason="DEEPSEEK_API_KEY env var missing")

        # Lazy initialization
        if not self.client:
            self.client = AsyncOpenAI(api_key=self.api_key, base_url=self.base_url)

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
            raise RuntimeError("Provider not ready")

        # Handle Reasoning Capability Toggle
        # DeepSeek-R1 logic: if model is 'deepseek-reasoner', extract reasoning_content
        is_reasoner = "reasoner" in model.model_id

        try:
            stream = await self.client.chat.completions.create(
                model=model.model_id, # e.g. "deepseek-reasoner"
                messages=messages,
                stream=True,
                max_tokens=limits.max_output_tokens or 4096
                # Note: User spec mentioned 8k+ for reasoning, handled via RunLimits configuration
            )

            async for chunk in stream:
                delta = chunk.choices[0].delta

                # Handling Reasoning Trace
                if is_reasoner and hasattr(delta, 'reasoning_content') and delta.reasoning_content:
                     yield {
                        "type": "content_delta",
                        "content": delta.reasoning_content,
                        "role": "reasoning_trace" # Tagging as trace for frontend parsing
                    }

                if delta.content:
                    yield {"type": "content_delta", "content": delta.content}

        except Exception as e:
            yield {"type": "error", "error": str(e)}
