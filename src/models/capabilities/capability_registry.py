from typing import List, Type

from atoms_agents.src.models.capabilities.audio_transcription.audio_transcription import AudioTranscriptionCapability
from atoms_agents.src.models.capabilities.audio_synthesis.audio_synthesis import AudioSynthesisCapability
from atoms_agents.src.models.capabilities.speaker_diarization.speaker_diarization import SpeakerDiarizationCapability
from atoms_agents.src.models.capabilities.audio_classification.audio_classification import AudioClassificationCapability
from atoms_agents.src.models.capabilities.music_beat_detection.music_beat_detection import MusicBeatDetectionCapability
from atoms_agents.src.models.capabilities.audio_stem_separation.audio_stem_separation import AudioStemSeparationCapability
from atoms_agents.src.models.capabilities.audio_emotion_detection.audio_emotion_detection import AudioEmotionDetectionCapability
from atoms_agents.src.models.capabilities.voice_cloning.voice_cloning import VoiceCloningCapability
from atoms_agents.src.models.capabilities.video_analysis.video_analysis import VideoAnalysisCapability
from atoms_agents.src.models.capabilities.video_generation.video_generation import VideoGenerationCapability
from atoms_agents.src.models.capabilities.video_editing.video_editing import VideoEditingCapability
from atoms_agents.src.models.capabilities.shot_detection.shot_detection import ShotDetectionCapability
from atoms_agents.src.models.capabilities.motion_analysis.motion_analysis import MotionAnalysisCapability
from atoms_agents.src.models.capabilities.image_analysis.image_analysis import ImageAnalysisCapability
from atoms_agents.src.models.capabilities.image_generation.image_generation import ImageGenerationCapability
from atoms_agents.src.models.capabilities.image_editing.image_editing import ImageEditingCapability
from atoms_agents.src.models.capabilities.background_removal.background_removal import BackgroundRemovalCapability
from atoms_agents.src.models.capabilities.style_transfer.style_transfer import StyleTransferCapability
from atoms_agents.src.models.capabilities.web_browsing.web_browsing import WebBrowsingCapability
from atoms_agents.src.models.capabilities.web_search.web_search import WebSearchCapability
from atoms_agents.src.models.capabilities.news_search.news_search import NewsSearchCapability
from atoms_agents.src.models.capabilities.image_search.image_search import ImageSearchCapability
from atoms_agents.src.models.capabilities.routing.routing import RoutingCapability
from atoms_agents.src.models.capabilities.geocoding.geocoding import GeocodingCapability
from atoms_agents.src.models.capabilities.elevation.elevation import ElevationCapability
from atoms_agents.src.models.capabilities.terrain_visualization.terrain_visualization import TerrainVisualizationCapability
from atoms_agents.src.models.capabilities.vector_storage.vector_storage import VectorStorageCapability
from atoms_agents.src.models.capabilities.vector_retrieval.vector_retrieval import VectorRetrievalCapability
from atoms_agents.src.models.capabilities.document_loading.document_loading import DocumentLoadingCapability
from atoms_agents.src.models.capabilities.chunking_strategy.chunking_strategy import ChunkingStrategyCapability
from atoms_agents.src.models.capabilities.embedding_generation.embedding_generation import EmbeddingGenerationCapability

CAPABILITY_REGISTRY: List[Type] = [
    AudioTranscriptionCapability,
    AudioSynthesisCapability,
    SpeakerDiarizationCapability,
    AudioClassificationCapability,
    MusicBeatDetectionCapability,
    AudioStemSeparationCapability,
    AudioEmotionDetectionCapability,
    VoiceCloningCapability,
    VideoAnalysisCapability,
    VideoGenerationCapability,
    VideoEditingCapability,
    ShotDetectionCapability,
    MotionAnalysisCapability,
    ImageAnalysisCapability,
    ImageGenerationCapability,
    ImageEditingCapability,
    BackgroundRemovalCapability,
    StyleTransferCapability,
    WebBrowsingCapability,
    WebSearchCapability,
    NewsSearchCapability,
    ImageSearchCapability,
    RoutingCapability,
    GeocodingCapability,
    ElevationCapability,
    TerrainVisualizationCapability,
    VectorStorageCapability,
    VectorRetrievalCapability,
    DocumentLoadingCapability,
    ChunkingStrategyCapability,
    EmbeddingGenerationCapability,
]

__all__ = ["CAPABILITY_REGISTRY"]
