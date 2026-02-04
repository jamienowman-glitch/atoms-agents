"""HuggingFace WhisperBaseHFProvider (openai/whisper-base) audio transporter."""
from typing import Optional

from atoms_agents.src.models.providers.huggingface.base import HuggingFaceProviderBase


class WhisperBaseHFProvider(HuggingFaceProviderBase):
    MODEL_ID = "openai/whisper-base"

    def __init__(self) -> None:
        super().__init__(self.MODEL_ID)

    async def transcribe_audio(
        self,
        audio_path: str,
        *,
        canvas_id: Optional[str] = None,
        thread_id: Optional[str] = None,
        actor_id: str = "system",
    ) -> str:
        return await super().transcribe(
            audio_path,
            canvas_id=canvas_id,
            thread_id=thread_id,
            actor_id=actor_id,
        )
