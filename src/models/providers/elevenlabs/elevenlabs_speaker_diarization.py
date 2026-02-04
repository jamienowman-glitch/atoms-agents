"""ElevenLabs ElevenLabsSpeakerDiarizationProvider (speaker-diarization) transcription."""
from typing import Optional

from atoms_agents.src.models.providers.elevenlabs.base import ElevenLabsProviderBase


class ElevenLabsSpeakerDiarizationProvider(ElevenLabsProviderBase):
    MODEL_ID = "speaker-diarization"

    def __init__(self) -> None:
        super().__init__()

    async def transcribe_audio(
        self,
        audio_path: str,
        *,
        canvas_id: Optional[str] = None,
        thread_id: Optional[str] = None,
        actor_id: str = "system",
        **kwargs: Any,
    ) -> str:
        return await super().transcribe_audio(
            audio_path,
            canvas_id=canvas_id,
            thread_id=thread_id,
            actor_id=actor_id,
            **kwargs,
        )
