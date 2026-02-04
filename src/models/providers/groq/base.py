"""Base helpers for Groq API integrations."""
import asyncio
from typing import Any, Dict, Optional

import requests

from atoms_agents.src.models.providers.common import log_inference_event, require_secret


class GroqProviderBase:
    """Shared configuration for Groq models."""

    PROVIDER_ID = "prov_groq"
    BASE_URL = "https://api.groq.com/openai/v1/chat/completions"

    def __init__(self, model_id: str) -> None:
        if not model_id:
            raise ValueError("Groq model_id is required")
        self.model_id = model_id
        api_key = require_secret(
            "GROQ_API_KEY",
            "groq_key.txt",
            "groq_key copy.txt",
            "groq-key.txt",
            "groq.txt",
        )
        self.api_key = api_key
        self.session = requests.Session()
        self.session.headers.update({
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        })

    def _call_api(self, prompt: str, temperature: float, max_tokens: int) -> Dict[str, Any]:
        payload = {
            "model": self.model_id,
            "messages": [{"role": "user", "content": prompt}],
            "temperature": temperature,
            "max_tokens": max_tokens,
        }
        response = self.session.post(self.BASE_URL, json=payload, timeout=60)
        response.raise_for_status()
        return response.json()

    @staticmethod
    def _extract_text(payload: Dict[str, Any]) -> str:
        choices = payload.get("choices", [])
        if choices:
            first = choices[0]
            if isinstance(first, dict):
                message = first.get("message", {})
                return message.get("content", "") or first.get("text", "")
        return ""

    @staticmethod
    def _extract_usage(payload: Dict[str, Any]) -> int:
        usage = payload.get("usage", {})
        if not isinstance(usage, dict):
            return 0
        return usage.get("total_tokens", 0)

    async def _log_response(
        self,
        prompt: str,
        output: Optional[str],
        tokens_used: int,
        canvas_id: Optional[str],
        thread_id: Optional[str],
        actor_id: str,
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
        try:
            payload = await asyncio.to_thread(self._call_api, prompt, temperature, max_tokens)
            text = self._extract_text(payload)
            tokens = self._extract_usage(payload)
            await self._log_response(
                prompt=prompt,
                output=text,
                tokens_used=tokens,
                canvas_id=canvas_id,
                thread_id=thread_id,
                actor_id=actor_id,
            )
            return text
        except Exception as exc:  # pragma: no cover - external call
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
