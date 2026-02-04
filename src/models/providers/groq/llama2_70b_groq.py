"""Text provider for llama2-70b-groq."""
from typing import Optional

from atoms_agents.src.models.providers.groq.base import GroqProviderBase


class Llama270bGroqProvider(GroqProviderBase):
    MODEL_ID = "llama-3.3-70b-versatile"

    def __init__(self) -> None:
        super().__init__(self.MODEL_ID)

    async def generate(
        self,
        prompt: str,
        *,
        temperature: float = 0.2,
        max_tokens: int = 512,
        canvas_id: Optional[str] = None,
        thread_id: Optional[str] = None,
        actor_id: str = "system",
    ) -> str:
        return await super().generate(
            prompt,
            temperature=temperature,
            max_tokens=max_tokens,
            canvas_id=canvas_id,
            thread_id=thread_id,
            actor_id=actor_id,
        )
