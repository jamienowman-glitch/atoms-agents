"""OpenAI GPT41Provider wrapping gpt-4.1."""
import os
from typing import Any, Dict, List, Optional

from atoms_agents.src.models.providers.openai.base import OpenAITextProvider


class GPT41Provider(OpenAITextProvider):
    MODEL_ID = "gpt-4.1"

    def __init__(self) -> None:
        super().__init__(self.MODEL_ID)

    async def generate(
        self,
        prompt: str,
        *,
        temperature: float = 0.3,
        max_tokens: int = 512,
        canvas_id: Optional[str] = None,
        thread_id: Optional[str] = None,
        actor_id: str = "system",
        messages: Optional[List[Dict[str, str]]] = None,
        **kwargs: Any,
    ) -> str:
        return await super().generate(
            prompt,
            temperature=temperature,
            max_tokens=max_tokens,
            canvas_id=canvas_id,
            thread_id=thread_id,
            actor_id=actor_id,
            messages=messages,
            **kwargs,
        )
