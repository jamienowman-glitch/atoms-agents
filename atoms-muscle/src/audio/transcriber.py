
"""Audio Transcriber Muscle: Faster-Whisper wrapper."""
from faster_whisper import WhisperModel
import os

class AudioTranscriber:
    def __init__(self, model_size="base", device="cpu"):
        self.model = WhisperModel(model_size, device=device, compute_type="int8")

    def transcribe(self, audio_path: str) -> str:
        """
        Transcribe audio file to text.
        """
        if not audio_path or not os.path.exists(audio_path):
            return ""

        segments, info = self.model.transcribe(audio_path, beam_size=5)
        text = " ".join([segment.text for segment in segments])
        return text.strip()
