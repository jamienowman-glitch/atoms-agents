
"""Shared ElevenLabs helpers (TTS + STT)."""
import asyncio
import base64
import os
from typing import Any, Dict, Optional

import requests

from atoms_agents.src.models.providers.common import log_inference_event, require_secret


class ElevenLabsProviderBase:
    PROVIDER_ID = "prov_elevenlabs"
    BASE_URL = "https://api.elevenlabs.io/v1"

    def __init__(self) -> None:
        api_key = require_secret(
            "ELEVENLABS_API_KEY",
            "elevenlabs-key.txt",
            "elevenlabs_api_key.txt",
            "elevenlabs.txt",
        )
        self.api_key = api_key
        self.session = requests.Session()
        self.session.headers.update({
            "x-api-key": self.api_key,
            "Content-Type": "application/json",
        })

    def _call_tts(self, text: str, voice: str) -> bytes:
        url = f"{self.BASE_URL}/text-to-speech/{voice}"
        payload = {"text": text}
        response = self.session.post(url, json=payload, timeout=60)
        response.raise_for_status()
        return response.content

    def _call_stt(self, path: str) -> Dict[str, Any]:
        url = f"{self.BASE_URL}/speech-to-text"
        with open(path, "rb") as fh:
            files = {"file": (os.path.basename(path), fh, "audio/wav")}
            response = self.session.post(url, files=files, timeout=60)
        response.raise_for_status()
        return response.json()

    @staticmethod
    def _extract_text(payload: Dict[str, Any]) -> str:
        if isinstance(payload, dict):
            return payload.get("text", "")
        return ""

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
            model_id="elevenlabs",
            input_text=prompt,
            output_text=output,
            tokens_used=tokens_used,
            cost=0.0,
            error=error,
            canvas_id=canvas_id,
            thread_id=thread_id,
            actor_id=actor_id,
        )

    async def synthesize_audio(
        self,
        text: str,
        *,
        voice: str = "alloy",
        canvas_id: Optional[str] = None,
        thread_id: Optional[str] = None,
        actor_id: str = "system",
    ) -> Dict[str, Any]:
        try:
            audio_bytes = await asyncio.to_thread(self._call_tts, text, voice)
            encoded = base64.b64encode(audio_bytes).decode("utf-8")
            await self._log_response(
                prompt=text,
                output=encoded,
                tokens_used=0,
                canvas_id=canvas_id,
                thread_id=thread_id,
                actor_id=actor_id,
            )
            return {"audio": audio_bytes, "b64": encoded}
        except Exception as exc:  # pragma: no cover - external call
            await self._log_response(
                prompt=text,
                output=None,
                tokens_used=0,
                canvas_id=canvas_id,
                thread_id=thread_id,
                actor_id=actor_id,
                error=str(exc),
            )
            raise

    async def transcribe_audio(
        self,
        audio_path: str,
        *,
        canvas_id: Optional[str] = None,
        thread_id: Optional[str] = None,
        actor_id: str = "system",
    ) -> str:
        try:
            payload = await asyncio.to_thread(self._call_stt, audio_path)
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
