"""OpenAI Whisper1Provider wrapping whisper-1."""
import os
from typing import Any, Dict, Optional

from atoms_agents.src.models.providers.openai.base import OpenAIAudioTranscriber


class Whisper1Provider(OpenAIAudioTranscriber):
    MODEL_ID = "whisper-1"

    def __init__(self) -> None:
        super().__init__(self.MODEL_ID)

    async def transcribe_audio(
        self,
        audio_file_path: str,
        *,
        canvas_id: Optional[str] = None,
        thread_id: Optional[str] = None,
        actor_id: str = "system",
        **kwargs: Any,
    ) -> str:
        return await super().transcribe(
            audio_file_path,
            canvas_id=canvas_id,
            thread_id=thread_id,
            actor_id=actor_id,
            **kwargs,
        )
