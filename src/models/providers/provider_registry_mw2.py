"""Mega-Worker 2 provider registry."""
from typing import List, Type

from atoms_agents.src.models.providers.mistral.mistral_large import MistralLargeProvider
from atoms_agents.src.models.providers.mistral.mistral_small import MistralSmallProvider
from atoms_agents.src.models.providers.mistral.mistral_medium import MistralMediumProvider
from atoms_agents.src.models.providers.mistral.mistral_7b import Mistral7BProvider
from atoms_agents.src.models.providers.mistral.mistral_vision import MistralVisionProvider
from atoms_agents.src.models.providers.mistral.mistral_function_calling import MistralFunctionCallingProvider
from atoms_agents.src.models.providers.groq.llama2_70b_groq import Llama270bGroqProvider
from atoms_agents.src.models.providers.groq.mixtral_8x7b_groq import Mixtral8x7bGroqProvider
from atoms_agents.src.models.providers.groq.gemma_7b_groq import Gemma7bGroqProvider
from atoms_agents.src.models.providers.groq.groq_custom import GroqCustomProvider
from atoms_agents.src.models.providers.openrouter.molmo_2_full import Molmo2FullProvider
from atoms_agents.src.models.providers.openrouter.molmo_2_compressed import Molmo2CompressedProvider
from atoms_agents.src.models.providers.openrouter.phi_3_medium import Phi3MediumProvider
from atoms_agents.src.models.providers.openrouter.neural_chat_7b import NeuralChat7BProvider
from atoms_agents.src.models.providers.openrouter.solar_10_7b import Solar107BProvider
from atoms_agents.src.models.providers.openrouter.mistral_7b_instruct import Mistral7BInstructProvider
from atoms_agents.src.models.providers.openrouter.openchat_3_5 import OpenChat35Provider
from atoms_agents.src.models.providers.openrouter.toppy_m_7b import ToppyM7BProvider
from atoms_agents.src.models.providers.openrouter.nous_hermes_2_mixtral import NousHermes2MixtralProvider
from atoms_agents.src.models.providers.openrouter.airoboros_l2_70b import AiroborosL270bProvider
from atoms_agents.src.models.providers.openrouter.gpt_3_5_openrouter import GPT35OpenRouterProvider
from atoms_agents.src.models.providers.openrouter.gpt_4_openrouter import GPT4OpenRouterProvider
from atoms_agents.src.models.providers.openrouter.claude_3_opus_openrouter import Claude3OpusOpenRouterProvider
from atoms_agents.src.models.providers.openrouter.openrouter_vision_model import OpenRouterVisionProvider
from atoms_agents.src.models.providers.openrouter.openrouter_audio_model import OpenRouterAudioProvider
from atoms_agents.src.models.providers.openrouter.mistral_8x7b_instruct import Mistral8x7bInstructProvider
from atoms_agents.src.models.providers.openrouter.phi_3_large import Phi3LargeProvider
from atoms_agents.src.models.providers.openrouter.falcon_40b_openrouter import Falcon40bOpenRouterProvider
from atoms_agents.src.models.providers.openrouter.falcon_7b_openrouter import Falcon7bOpenRouterProvider
from atoms_agents.src.models.providers.openrouter.starcoder_15b import StarCoder15bProvider
from atoms_agents.src.models.providers.openrouter.mixtral_8x7b_openrouter import Mixtral8x7bOpenRouterProvider
from atoms_agents.src.models.providers.openrouter.gpt_neo_x_20b import GPTNeoX20bProvider
from atoms_agents.src.models.providers.openrouter.xgen_20b import XGen20bProvider
from atoms_agents.src.models.providers.openrouter.dolphin_2 import Dolphin2Provider
from atoms_agents.src.models.providers.openrouter.code_llama_34b import CodeLlama34bProvider
from atoms_agents.src.models.providers.nvidia.nvidia_nemo_gpt import NvidiaNemoGPTProvider
from atoms_agents.src.models.providers.nvidia.nvidia_vista import NvidiaVistaProvider
from atoms_agents.src.models.providers.nvidia.nvidia_cuda_text_gen import NvidiaCudaTextGenProvider
from atoms_agents.src.models.providers.nvidia.nvidia_turbo_vision import NvidiaTurboVisionProvider
from atoms_agents.src.models.providers.nvidia.nvidia_av100_model import NvidiaAV100ModelProvider
from atoms_agents.src.models.providers.huggingface.llama_2_70b_hf import Llama270bHFProvider
from atoms_agents.src.models.providers.huggingface.mistral_7b_hf import Mistral7bHFProvider
from atoms_agents.src.models.providers.huggingface.falcon_40b import Falcon40bProvider
from atoms_agents.src.models.providers.huggingface.bloom_175b import Bloom175bProvider
from atoms_agents.src.models.providers.huggingface.gpt2_large import GPT2LargeProvider
from atoms_agents.src.models.providers.huggingface.t5_large import T5LargeProvider
from atoms_agents.src.models.providers.huggingface.stable_diffusion_xl import StableDiffusionXlProvider
from atoms_agents.src.models.providers.huggingface.whisper_base_hf import WhisperBaseHFProvider
from atoms_agents.src.models.providers.elevenlabs.elevenlabs_multilingual_v1 import ElevenLabsMultilingualV1Provider
from atoms_agents.src.models.providers.elevenlabs.elevenlabs_multilingual_v2 import ElevenLabsMultilingualV2Provider
from atoms_agents.src.models.providers.elevenlabs.elevenlabs_voice_clone import ElevenLabsVoiceCloneProvider
from atoms_agents.src.models.providers.elevenlabs.elevenlabs_speech_enhancement import ElevenLabsSpeechEnhancementProvider
from atoms_agents.src.models.providers.elevenlabs.elevenlabs_speaker_diarization import ElevenLabsSpeakerDiarizationProvider
from atoms_agents.src.models.providers.elevenlabs.elevenlabs_voice_conversion import ElevenLabsVoiceConversionProvider
from atoms_agents.src.models.providers.elevenlabs.elevenlabs_isolated_stt import ElevenLabsIsolatedSttProvider
from atoms_agents.src.models.providers.elevenlabs.elevenlabs_isolated_dubbing import ElevenLabsIsolatedDubbingProvider
from atoms_agents.src.models.providers.maps.google.google_maps_routing import GoogleMapsRoutingProvider
from atoms_agents.src.models.providers.maps.google.google_maps_elevation import GoogleMapsElevationProvider
from atoms_agents.src.models.providers.maps.mapbox.mapbox_routing import MapboxRoutingProvider
from atoms_agents.src.models.providers.maps.mapbox.mapbox_terrain import MapboxTerrainProvider
from atoms_agents.src.models.providers.maps.osm.osm_routing import OsmRoutingProvider
from atoms_agents.src.models.providers.maps.osm.osm_geocoding import OsmGeocodingProvider

PROVIDER_REGISTRY_MW2: List[Type] = [
    MistralLargeProvider,
    MistralSmallProvider,
    MistralMediumProvider,
    Mistral7BProvider,
    MistralVisionProvider,
    MistralFunctionCallingProvider,
    Llama270bGroqProvider,
    Mixtral8x7bGroqProvider,
    Gemma7bGroqProvider,
    GroqCustomProvider,
    Molmo2FullProvider,
    Molmo2CompressedProvider,
    Phi3MediumProvider,
    NeuralChat7BProvider,
    Solar107BProvider,
    Mistral7BInstructProvider,
    OpenChat35Provider,
    ToppyM7BProvider,
    NousHermes2MixtralProvider,
    AiroborosL270bProvider,
    GPT35OpenRouterProvider,
    GPT4OpenRouterProvider,
    Claude3OpusOpenRouterProvider,
    OpenRouterVisionProvider,
    OpenRouterAudioProvider,
    Mistral8x7bInstructProvider,
    Phi3LargeProvider,
    Falcon40bOpenRouterProvider,
    Falcon7bOpenRouterProvider,
    StarCoder15bProvider,
    Mixtral8x7bOpenRouterProvider,
    GPTNeoX20bProvider,
    XGen20bProvider,
    Dolphin2Provider,
    CodeLlama34bProvider,
    NvidiaNemoGPTProvider,
    NvidiaVistaProvider,
    NvidiaCudaTextGenProvider,
    NvidiaTurboVisionProvider,
    NvidiaAV100ModelProvider,
    Llama270bHFProvider,
    Mistral7bHFProvider,
    Falcon40bProvider,
    Bloom175bProvider,
    GPT2LargeProvider,
    T5LargeProvider,
    StableDiffusionXlProvider,
    WhisperBaseHFProvider,
    ElevenLabsMultilingualV1Provider,
    ElevenLabsMultilingualV2Provider,
    ElevenLabsVoiceCloneProvider,
    ElevenLabsSpeechEnhancementProvider,
    ElevenLabsSpeakerDiarizationProvider,
    ElevenLabsVoiceConversionProvider,
    ElevenLabsIsolatedSttProvider,
    ElevenLabsIsolatedDubbingProvider,
    GoogleMapsRoutingProvider,
    GoogleMapsElevationProvider,
    MapboxRoutingProvider,
    MapboxTerrainProvider,
    OsmRoutingProvider,
    OsmGeocodingProvider,
]
