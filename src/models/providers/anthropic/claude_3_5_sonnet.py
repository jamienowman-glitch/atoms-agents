"""Anthropic Claude35SonnetProvider wrapping claude-3.5-sonnet."""
import os
from typing import Any, Dict, Optional

from atoms_agents.src.models.providers.anthropic.base import AnthropicTextProvider


class Claude35SonnetProvider(AnthropicTextProvider):
    MODEL_ID = "claude-3.5-sonnet"

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
        **kwargs: Any,
    ) -> str:
        return await super().generate(
            prompt,
            temperature=temperature,
            max_tokens=max_tokens,
            canvas_id=canvas_id,
            thread_id=thread_id,
            actor_id=actor_id,
            **kwargs,
        )
