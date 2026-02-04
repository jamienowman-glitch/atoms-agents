"""Base utilities for Anthropic Claude providers."""
import asyncio
from typing import Any, Dict, Optional, Sequence

import anthropic

from atoms_agents.src.models.providers.common import log_inference_event, require_secret


class AnthropicProviderBase:
    """Shared configuration for Anthropic models."""

    PROVIDER_ID = "prov_anthropic"

    def __init__(self, model_id: str) -> None:
        if not model_id:
            raise ValueError("Anthropic model_id is required")
        api_key = require_secret(
            "ANTHROPIC_API_KEY",
            "anthropic-api-key.txt",
            "anthropic_key.txt",
            "anthropic.txt",
        )
        self.model_id = model_id
        self.client = anthropic.Anthropic(api_key=api_key)

    @staticmethod
    def _extract_output(response: Any) -> str:
        completion = getattr(response, "completion", None)
        if completion:
            return completion
        if isinstance(response, dict):
            return response.get("completion", "")
        return ""

    @staticmethod
    def _extract_usage(response: Any) -> int:
        usage = getattr(response, "usage", None)
        if not usage and isinstance(response, dict):
            usage = response.get("usage") or {}
        if not usage:
            return 0
        if isinstance(usage, dict):
            return usage.get("total_tokens", 0)
        return 0

    async def _log_response(
        self,
        prompt: str,
        output: Optional[str],
        canvas_id: Optional[str],
        thread_id: Optional[str],
        actor_id: str,
        tokens_used: int,
        error: Optional[str] = None,
    ) -> None:
        await log_inference_event(
            provider_id=self.PROVIDER_ID,
            model_id=self.model_id,
            input_text=prompt,
            output_text=output,
            tokens_used=tokens_used,
            cost=0.0,
            error=error,
            canvas_id=canvas_id,
            thread_id=thread_id,
            actor_id=actor_id,
        )


class AnthropicTextProvider(AnthropicProviderBase):
    """Text generation wrapper for Claude models."""

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
        """Generate text using Anthropic completions."""
        body = {
            "model": self.model_id,
            "prompt": prompt,
            "temperature": temperature,
            "max_tokens_to_sample": max_tokens,
        }
        body.update(kwargs)

        try:
            response = await asyncio.to_thread(self.client.completions.create, **body)
            text = self._extract_output(response)
            tokens = self._extract_usage(response)
            await self._log_response(
                prompt=prompt,
                output=text,
                tokens_used=tokens,
                canvas_id=canvas_id,
                thread_id=thread_id,
                actor_id=actor_id,
            )
            return text
        except Exception as exc:  # pragma: no cover
            await self._log_response(
                prompt=prompt,
                output=None,
                tokens_used=0,
                canvas_id=canvas_id,
                thread_id=thread_id,
                actor_id=actor_id,
                error=str(exc),
            )
            raise
