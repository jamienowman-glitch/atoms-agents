"""Shared Google Gemini provider helpers."""
import asyncio
from typing import Any, Dict, List, Optional

import google.generativeai as genai

from atoms_agents.src.models.providers.common import log_inference_event, require_secret


class GoogleProviderBase:
    """Shared configuration for Google Gemini providers."""

    PROVIDER_ID = "prov_google"

    def __init__(self, model_id: str) -> None:
        if not model_id:
            raise ValueError("Google model_id is required")
        api_key = require_secret(
            "GOOGLE_API_KEY",
            "gemini-aistudio.txt",
            "google-api-key.txt",
            "google_api_key.txt",
            "google.txt",
        )

        self.model_id = model_id
        # Keep configure idempotent
        genai.configure(api_key=api_key)
        self.client = genai

    @staticmethod
    def _extract_text(response: Any) -> str:
        candidates = getattr(response, "candidates", None)
        if not candidates and isinstance(response, dict):
            candidates = response.get("candidates") or []
        if not candidates:
            return ""
        first = candidates[0]
        if hasattr(first, "output"):
            return getattr(first, "output") or ""
        if isinstance(first, dict):
            return first.get("output", "")
        return ""

    @staticmethod
    def _extract_images(response: Any) -> List[Dict[str, Any]]:
        candidates = getattr(response, "candidates", None)
        if not candidates and isinstance(response, dict):
            candidates = response.get("candidates") or []
        processed: List[Dict[str, Any]] = []
        for candidate in candidates:
            if hasattr(candidate, "image"):
                image = getattr(candidate, "image")
            elif isinstance(candidate, dict):
                image = candidate.get("image")
            else:
                image = None
            if isinstance(image, dict):
                processed.append(image)
        return processed

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


class GoogleTextProvider(GoogleProviderBase):
    """Text generation base for Gemini."""

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
        """Generate text via the Gemini text endpoint."""
        body = {
            "model": self.model_id,
            "prompt": prompt,
            "temperature": temperature,
            "max_output_tokens": max_output_tokens,
        }
        body.update(kwargs)
        try:
            response = await asyncio.to_thread(self.client.generate_text, **body)
            text = self._extract_text(response)
            await self._log_response(
                prompt=prompt,
                output=text,
                tokens_used=0,
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


class GoogleImageProvider(GoogleProviderBase):
    """Image generation base for Google."""

    async def generate_image(
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
        """Generate an image via Gemini image API."""
        body = {
            "model": self.model_id,
            "prompt": prompt,
            "size": size,
            "image_count": image_count,
        }
        body.update(kwargs)
        try:
            response = await asyncio.to_thread(self.client.generate_image, **body)
            images = self._extract_images(response)
            await self._log_response(
                prompt=prompt,
                output=images[0].get("b64") if images else "",
                tokens_used=0,
                canvas_id=canvas_id,
                thread_id=thread_id,
                actor_id=actor_id,
            )
            return {"images": images}
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
