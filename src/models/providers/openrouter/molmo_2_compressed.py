"""OpenRouter provider for allenai/molmo-2-compressed."""
from typing import Optional

from atoms_agents.src.models.providers.openrouter.base import OpenRouterProviderBase


class Molmo2CompressedProvider(OpenRouterProviderBase):
    MODEL_ID = "arcee-ai/trinity-mini:free"

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
