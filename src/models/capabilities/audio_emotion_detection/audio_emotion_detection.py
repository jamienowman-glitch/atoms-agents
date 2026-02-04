"""Audio Emotion Detection capability."""
from atoms_agents.src.models.capabilities.base_capability import BaseCapability


class AudioEmotionDetectionCapability(BaseCapability):
    CAPABILITY_ID = "audio_emotion_detection"
    NAME = "Audio Emotion Detection"
    DESCRIPTION = "Detect emotion in speech."
    SUPPORTED_BACKENDS = ['huggingface']
