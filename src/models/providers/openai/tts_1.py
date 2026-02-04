"""OpenAI TTS1Provider wrapping tts-1."""
import os
from typing import Any, Dict, Optional

from atoms_agents.src.models.providers.openai.base import OpenAIAudioSynthesizer


class TTS1Provider(OpenAIAudioSynthesizer):
    MODEL_ID = "tts-1"

    def __init__(self) -> None:
        super().__init__(self.MODEL_ID)

    async def generate_audio_output(
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
        return await super().generate_audio(
            text,
            voice=voice,
            audio_format=audio_format,
            canvas_id=canvas_id,
            thread_id=thread_id,
            actor_id=actor_id,
            **kwargs,
        )
