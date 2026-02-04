"""OpenAI GPTImage15Provider wrapping gpt-image-1.5."""
import os
from typing import Any, Dict, List, Optional

from atoms_agents.src.models.providers.openai.base import OpenAIImageProvider


class GPTImage15Provider(OpenAIImageProvider):
    MODEL_ID = "gpt-image-1.5"

    def __init__(self) -> None:
        super().__init__(self.MODEL_ID)

    async def generate_image_prompt(
        self,
        prompt: str,
        *,
        size: str = "1024x1024",
        image_count: int = 1,
        canvas_id: Optional[str] = None,
        thread_id: Optional[str] = None,
        actor_id: str = "system",
        **kwargs: Any,
    ) -> Dict[str, Any]:
        return await super().generate_image(
            prompt,
            size=size,
            image_count=image_count,
            canvas_id=canvas_id,
            thread_id=thread_id,
            actor_id=actor_id,
            **kwargs,
        )
