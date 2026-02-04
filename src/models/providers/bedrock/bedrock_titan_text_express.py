"""Bedrock TitanTextExpressBedrockProvider wrapping amazon.nova-micro-v1:0."""
import os
from typing import Any, Dict, Optional

from atoms_agents.src.models.providers.bedrock.base import BedrockProviderBase


class TitanTextExpressBedrockProvider(BedrockProviderBase):
    MODEL_ID = "amazon.nova-micro-v1:0"

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
        return await super().generate(
            prompt,
            canvas_id=canvas_id,
            thread_id=thread_id,
            actor_id=actor_id,
            **kwargs,
        )
