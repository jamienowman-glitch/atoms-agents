"""Google Gemini3FlashProvider wrapping gemini-3-flash."""
import os
from typing import Any, Dict, Optional

from atoms_agents.src.models.providers.google.base import GoogleTextProvider


class Gemini3FlashProvider(GoogleTextProvider):
    MODEL_ID = "gemini-3-flash"

    def __init__(self) -> None:
        super().__init__(self.MODEL_ID)

    async def generate(
        self,
        prompt: str,
        *,
        temperature: float = 0.2,
        max_output_tokens: int = 512,
        canvas_id: Optional[str] = None,
        thread_id: Optional[str] = None,
        actor_id: str = "system",
        **kwargs: Any,
    ) -> str:
        return await super().generate(
            prompt,
            temperature=temperature,
            max_output_tokens=max_output_tokens,
            canvas_id=canvas_id,
            thread_id=thread_id,
            actor_id=actor_id,
            **kwargs,
        )
