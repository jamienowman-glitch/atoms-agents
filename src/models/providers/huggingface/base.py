
"""Base helpers for HuggingFace inference API."""
import asyncio
from typing import Any, Dict, List, Optional

from huggingface_hub import InferenceClient

from atoms_agents.src.models.providers.common import log_inference_event, require_secret


class HuggingFaceProviderBase:
    PROVIDER_ID = "prov_huggingface"

    def __init__(self, model_id: str) -> None:
        if not model_id:
            raise ValueError("HuggingFace model_id is required")
        self.model_id = model_id
        api_key = require_secret(
            "HUGGINGFACE_API_KEY",
            "huggingface-api-key.txt",
            "huggingface_api_key.txt",
            "huggingface.txt",
        )
        self.client = InferenceClient(api_key)

    def _call_api(self, prompt: str, temperature: float, max_tokens: int) -> Any:
        return self.client.text_generation(
            model=self.model_id,
            inputs=prompt,
            parameters={
                "temperature": temperature,
                "max_new_tokens": max_tokens,
                "return_full_text": False,
                "wait_for_model": True,
            },
        )

    def _call_image(self, prompt: str, image_count: int) -> Any:
        return self.client.text_to_image(
            model=self.model_id,
            prompt=prompt,
            parameters={"num_images": image_count},
        )

    def _call_transcription(self, audio_path: str) -> Any:
        return self.client.speech_to_text(
            model=self.model_id,
            audio=audio_path,
        )

    @staticmethod
    def _extract_text(payload: Any) -> str:
        if isinstance(payload, dict):
            if "generated_text" in payload:
                return payload["generated_text"]
            outputs = payload.get("outputs")
            if isinstance(outputs, list) and outputs:
                first = outputs[0]
                if isinstance(first, dict):
                    return first.get("generated_text", "")
        if isinstance(payload, list) and payload:
            first = payload[0]
            if isinstance(first, dict):
                return first.get("generated_text", "")
        return ""

    @staticmethod
    def _extract_images(payload: Any) -> List[str]:
        if isinstance(payload, dict) and "images" in payload:
            return [item for item in payload.get("images") if isinstance(item, str)]
        return []

    @staticmethod
    def _extract_usage(payload: Any) -> int:
        if isinstance(payload, dict):
            usage = payload.get("usage")
            if isinstance(usage, dict):
                return usage.get("total_tokens", 0)
        return 0

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
        max_output_tokens: int = 512,
        canvas_id: Optional[str] = None,
        thread_id: Optional[str] = None,
        actor_id: str = "system",
    ) -> str:
        try:
            payload = await asyncio.to_thread(self._call_api, prompt, temperature, max_output_tokens)
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

    async def generate_image(
        self,
        prompt: str,
        *,
        image_count: int = 1,
        canvas_id: Optional[str] = None,
        thread_id: Optional[str] = None,
        actor_id: str = "system",
    ) -> Dict[str, Any]:
        try:
            payload = await asyncio.to_thread(self._call_image, prompt, image_count)
            images = self._extract_images(payload)
            await self._log_response(
                prompt=prompt,
                output=images[0] if images else None,
                tokens_used=0,
                canvas_id=canvas_id,
                thread_id=thread_id,
                actor_id=actor_id,
            )
            return {"images": images}
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

    async def transcribe(
        self,
        audio_path: str,
        *,
        canvas_id: Optional[str] = None,
        thread_id: Optional[str] = None,
        actor_id: str = "system",
    ) -> str:
        try:
            payload = await asyncio.to_thread(self._call_transcription, audio_path)
            text = self._extract_text(payload)
            await self._log_response(
                prompt=audio_path,
                output=text,
                tokens_used=0,
                canvas_id=canvas_id,
                thread_id=thread_id,
                actor_id=actor_id,
            )
            return text
        except Exception as exc:  # pragma: no cover - external call
            await self._log_response(
                prompt=audio_path,
                output=None,
                tokens_used=0,
                canvas_id=canvas_id,
                thread_id=thread_id,
                actor_id=actor_id,
                error=str(exc),
            )
            raise
