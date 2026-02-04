"""Bedrock TitanImageGeneratorBedrockProvider wrapping amazon.titan-image-generator-v2:0."""
import os
from typing import Any, Dict, Optional

from atoms_agents.src.models.providers.bedrock.base import BedrockProviderBase


class TitanImageGeneratorBedrockProvider(BedrockProviderBase):
    MODEL_ID = "amazon.titan-image-generator-v2:0"

    def __init__(self) -> None:
        super().__init__(self.MODEL_ID)

    async def generate_image(
        self,
        prompt: str,
        *,
        canvas_id: Optional[str] = None,
        thread_id: Optional[str] = None,
        actor_id: str = "system",
        **kwargs: Any,
    ) -> Dict[str, Any]:
        return await super().generate_image(
            prompt,
            canvas_id=canvas_id,
            thread_id=thread_id,
            actor_id=actor_id,
            **kwargs,
        )
