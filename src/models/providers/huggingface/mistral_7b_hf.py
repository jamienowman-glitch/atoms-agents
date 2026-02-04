"""HuggingFace Mistral7bHFProvider (mistralai/Mistral-7B)."""
from typing import Optional

from atoms_agents.src.models.providers.huggingface.base import HuggingFaceProviderBase


class Mistral7bHFProvider(HuggingFaceProviderBase):
    MODEL_ID = "mistralai/Mistral-7B"

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
    ) -> str:
        return await super().generate(
            prompt,
            temperature=temperature,
            max_output_tokens=max_output_tokens,
            canvas_id=canvas_id,
            thread_id=thread_id,
            actor_id=actor_id,
        )
