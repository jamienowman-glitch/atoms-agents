"""Shared OpenRouter HTTP helpers."""
import asyncio
import os
from typing import Any, Dict, List, Optional

import requests

from atoms_agents.src.models.providers.common import log_inference_event, require_secret


class OpenRouterProviderBase:
    PROVIDER_ID = "prov_openrouter"
    BASE_URL = "https://openrouter.ai/api/v1"

    def __init__(self, model_id: str) -> None:
        if not model_id:
            raise ValueError("OpenRouter model_id is required")
        self.model_id = model_id
        api_key = require_secret(
            "OPENROUTER_API_KEY",
            "openrouter",
            "openrouter-key.txt",
            "openrouter_api_key.txt",
            "openrouter.txt",
        )
        self.api_key = api_key
        self.session = requests.Session()
        referer = os.getenv("OPENROUTER_APP_URL", "http://localhost")
        title = os.getenv("OPENROUTER_APP_NAME", "atoms-agents")
        self.session.headers.update({
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": referer,
            "X-Title": title,
        })

    def _build_payload(self, prompt: str, temperature: float, max_tokens: int) -> Dict[str, Any]:
        return {
            "model": self.model_id,
            "messages": [{"role": "user", "content": prompt}],
            "temperature": temperature,
            "max_tokens": max_tokens,
        }

    def _call_api(self, prompt: str, temperature: float, max_tokens: int) -> Dict[str, Any]:
        payload = self._build_payload(prompt, temperature, max_tokens)
        url = f"{self.BASE_URL}/chat/completions"
        response = self.session.post(url, json=payload, timeout=60)
        response.raise_for_status()
        return response.json()

    @staticmethod
    def _extract_text(payload: Dict[str, Any]) -> str:
        choices = payload.get("choices", [])
        if choices:
            first = choices[0]
            return first.get("message", {}).get("content", "")
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
