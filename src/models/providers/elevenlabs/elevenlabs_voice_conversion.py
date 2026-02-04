"""ElevenLabs ElevenLabsVoiceConversionProvider (voice-conversion)."""
from typing import Any, Dict, Optional

from atoms_agents.src.models.providers.elevenlabs.base import ElevenLabsProviderBase


class ElevenLabsVoiceConversionProvider(ElevenLabsProviderBase):
    MODEL_ID = "voice-conversion"

    def __init__(self) -> None:
        super().__init__()

    async def generate_audio(
        self,
        text: str,
        *,
        voice: str = "alloy",
        canvas_id: Optional[str] = None,
        thread_id: Optional[str] = None,
        actor_id: str = "system",
        **kwargs: Any,
    ) -> Dict[str, Any]:
        return await super().synthesize_audio(
            text,
            voice=voice,
            canvas_id=canvas_id,
            thread_id=thread_id,
            actor_id=actor_id,
            **kwargs,
        )
