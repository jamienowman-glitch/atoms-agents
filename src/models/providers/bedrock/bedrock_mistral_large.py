"""Bedrock MistralLargeBedrockProvider wrapping mistralai.mistral-large."""
import os
from typing import Any, Dict, Optional

from atoms_agents.src.models.providers.bedrock.base import BedrockProviderBase


class MistralLargeBedrockProvider(BedrockProviderBase):
    MODEL_ID = "mistral.mistral-large-2402-v1:0"

    def __init__(self) -> None:
        super().__init__(self.MODEL_ID)

    async def generate(
        self,
        prompt: str,
        *,
        canvas_id: Optional[str] = None,
        thread_id: Optional[str] = None,
        actor_id: str = "system",
        **kwargs: Any,
    ) -> str:
        formatted_prompt = f"<s>[INST] {prompt} [/INST]"
        payload: Dict[str, Any] = {
            "prompt": formatted_prompt,
            "max_tokens": kwargs.pop("max_tokens", 256),
            "temperature": kwargs.pop("temperature", 0.2),
        }
        return await super().generate(
            prompt,
            canvas_id=canvas_id,
            thread_id=thread_id,
            actor_id=actor_id,
            payload=payload,
            **kwargs,
        )
