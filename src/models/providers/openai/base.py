"""Shared OpenAI provider helpers for text, audio, and image models."""
import asyncio
import base64
from typing import Any, Dict, Optional, Sequence

from openai import OpenAI

from atoms_agents.src.models.providers.common import log_inference_event, require_secret


class OpenAIProviderBase:
    """Common OpenAI provider behavior."""

    PROVIDER_ID = "prov_openai"

    def __init__(self, model_id: str) -> None:
        if not model_id:
            raise ValueError("OpenAI model_id is required")
        api_key = require_secret(
            "OPENAI_API_KEY",
            "openai-key.txt",
            "openai_api_key.txt",
            "openai.txt",
        )
        self.model_id = model_id
        self.client = OpenAI(api_key=api_key)

    @staticmethod
    def _extract_text_from_choice(choice: Any) -> str:
        message = getattr(choice, "message", None)
        if message:
            content = getattr(message, "content", None)
            if content:
                return content
            if isinstance(message, dict):
                return message.get("content", "")

        if isinstance(choice, dict):
            if "message" in choice:
                return choice["message"].get("content", "")
            return choice.get("text", "")

        return getattr(choice, "text", "") or ""

    @staticmethod
    def _extract_output_text(response: Any) -> str:
        choices = getattr(response, "choices", None)
        if not choices and isinstance(response, dict):
            choices = response.get("choices") or []
        if not choices:
            return ""
        first = choices[0]
        return OpenAIProviderBase._extract_text_from_choice(first) or ""

    @staticmethod
    def _extract_usage(response: Any) -> int:
        usage = getattr(response, "usage", None)
        if not usage and isinstance(response, dict):
            usage = response.get("usage") or {}
        if not usage:
            return 0
        if isinstance(usage, dict):
            total = usage.get("total_tokens")
            if total is not None:
                return total
            return usage.get("prompt_tokens", 0) + usage.get("completion_tokens", 0)
        return 0

    async def _log_response(
        self,
        input_text: Optional[str],
        output_text: Optional[str],
        tokens_used: int,
        canvas_id: Optional[str],
        thread_id: Optional[str],
        actor_id: str,
        error: Optional[str] = None,
    ) -> None:
        await log_inference_event(
            provider_id=self.PROVIDER_ID,
            model_id=self.model_id,
            input_text=input_text,
            output_text=output_text,
            tokens_used=tokens_used,
            cost=0.0,
            error=error,
            canvas_id=canvas_id,
            thread_id=thread_id,
            actor_id=actor_id,
        )


class OpenAITextProvider(OpenAIProviderBase):
    """Base class for OpenAI text generation models."""

    async def generate(
        self,
        prompt: str,
        *,
        temperature: float = 0.3,
        max_tokens: int = 512,
        canvas_id: Optional[str] = None,
        thread_id: Optional[str] = None,
        actor_id: str = "system",
        messages: Optional[Sequence[Dict[str, str]]] = None,
        **kwargs: Any,
    ) -> str:
        """Generate text with the OpenAI chat completion endpoint."""
        request_body = {
            "model": self.model_id,
            "messages": messages
            if messages is not None
            else [{"role": "user", "content": prompt}],
            "temperature": temperature,
            "max_tokens": max_tokens,
        }
        request_body.update(kwargs)

        try:
            response = await asyncio.to_thread(self.client.chat.completions.create, **request_body)
            output = self._extract_output_text(response)
            tokens_used = self._extract_usage(response)
            await self._log_response(
                input_text=prompt,
                output_text=output,
                tokens_used=tokens_used,
                canvas_id=canvas_id,
                thread_id=thread_id,
                actor_id=actor_id,
            )
            return output
        except Exception as exc:  # pragma: no cover - external call
            await self._log_response(
                input_text=prompt,
                output_text=None,
                tokens_used=0,
                canvas_id=canvas_id,
                thread_id=thread_id,
                actor_id=actor_id,
                error=str(exc),
            )
            raise


class OpenAIAudioTranscriber(OpenAIProviderBase):
    """Base class for Whisper-style speech-to-text models."""

    def _transcribe_sync(self, audio_file_path: str, **kwargs: Any) -> Any:
        with open(audio_file_path, "rb") as audio:
            return self.client.audio.transcriptions.create(
                model=self.model_id,
                file=audio,
                **kwargs,
            )

    async def transcribe(
        self,
        audio_file_path: str,
        *,
        canvas_id: Optional[str] = None,
        thread_id: Optional[str] = None,
        actor_id: str = "system",
        **kwargs: Any,
    ) -> str:
        """Transcribe audio via Whisper."""
        try:
            response = await asyncio.to_thread(self._transcribe_sync, audio_file_path, **kwargs)
            output = getattr(response, "text", None) or (response.get("text") if isinstance(response, dict) else "")
            tokens_used = self._extract_usage(response)
            await self._log_response(
                input_text=audio_file_path,
                output_text=output,
                tokens_used=tokens_used,
                canvas_id=canvas_id,
                thread_id=thread_id,
                actor_id=actor_id,
            )
            return output
        except Exception as exc:  # pragma: no cover
            await self._log_response(
                input_text=audio_file_path,
                output_text=None,
                tokens_used=0,
                canvas_id=canvas_id,
                thread_id=thread_id,
                actor_id=actor_id,
                error=str(exc),
            )
            raise


class OpenAIAudioSynthesizer(OpenAIProviderBase):
    """Base class for TTS models."""

    def _synthesize_sync(self, text: str, voice: str, audio_format: str, **kwargs: Any) -> Any:
        return self.client.audio.speech.create(
            model=self.model_id,
            voice=voice,
            input=text,
            format=audio_format,
            **kwargs,
        )

    async def generate_audio(
        self,
        text: str,
        *,
        voice: str = "alloy",
        audio_format: str = "mp3",
        canvas_id: Optional[str] = None,
        thread_id: Optional[str] = None,
        actor_id: str = "system",
        **kwargs: Any,
    ) -> Dict[str, Any]:
        """Synthesize speech."""
        try:
            response = await asyncio.to_thread(self._synthesize_sync, text, voice, audio_format, **kwargs)
            audio_url = getattr(response, "url", None) or (response.get("url") if isinstance(response, dict) else None)
            audio_bytes = None
            if isinstance(response, dict):
                if "audio" in response:
                    payload = response["audio"]
                    if isinstance(payload, dict) and "b64" in payload:
                        audio_bytes = base64.b64decode(payload["b64"])
            await self._log_response(
                input_text=text,
                output_text=audio_url or "",
                tokens_used=0,
                canvas_id=canvas_id,
                thread_id=thread_id,
                actor_id=actor_id,
            )
            return {"audio_url": audio_url, "bytes": audio_bytes}
        except Exception as exc:  # pragma: no cover
            await self._log_response(
                input_text=text,
                output_text=None,
                tokens_used=0,
                canvas_id=canvas_id,
                thread_id=thread_id,
                actor_id=actor_id,
                error=str(exc),
            )
            raise


class OpenAIImageProvider(OpenAIProviderBase):
    """Base class for image generation models."""

    def _generate_sync(self, prompt: str, size: str, image_count: int = 1, **kwargs: Any) -> Any:
        return self.client.images.generate(
            model=self.model_id,
            prompt=prompt,
            size=size,
            image_count=image_count,
            **kwargs,
        )

    @staticmethod
    def _extract_images(response: Any) -> Sequence[str]:
        data = getattr(response, "data", None)
        if not data and isinstance(response, dict):
            data = response.get("data") or []
        processed: list[str] = []
        for item in data or []:
            b64 = getattr(item, "b64_json", None) or (item.get("b64_json") if isinstance(item, dict) else None)
            if b64:
                processed.append(b64)
        return processed

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
        """Generate an image using OpenAI image API."""
        try:
            response = await asyncio.to_thread(self._generate_sync, prompt, size, image_count, **kwargs)
            choices = self._extract_images(response)
            await self._log_response(
                input_text=prompt,
                output_text=choices[0] if choices else "",
                tokens_used=0,
                canvas_id=canvas_id,
                thread_id=thread_id,
                actor_id=actor_id,
            )
            return {"images": choices}
        except Exception as exc:  # pragma: no cover
            await self._log_response(
                input_text=prompt,
                output_text=None,
                tokens_used=0,
                canvas_id=canvas_id,
                thread_id=thread_id,
                actor_id=actor_id,
                error=str(exc),
            )
            raise
