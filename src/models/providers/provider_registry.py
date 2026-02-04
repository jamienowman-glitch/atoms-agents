"""Auto-discovered provider registry for Mega-Worker 1 models."""
from typing import List, Type

from atoms_agents.src.models.providers.anthropic.claude_3_5_sonnet import Claude35SonnetProvider
from atoms_agents.src.models.providers.anthropic.claude_3_6_opus import Claude36OpusProvider
from atoms_agents.src.models.providers.anthropic.claude_3_7_haiku import Claude37HaikuProvider
from atoms_agents.src.models.providers.anthropic.claude_3_7_opus import Claude37OpusProvider
from atoms_agents.src.models.providers.anthropic.claude_3_7_sonnet import Claude37SonnetProvider
from atoms_agents.src.models.providers.anthropic.claude_computer_use import ClaudeComputerUseProvider
from atoms_agents.src.models.providers.anthropic.claude_vision import ClaudeVisionProvider
from atoms_agents.src.models.providers.bedrock.bedrock_claude_3_7_haiku import Claude37HaikuBedrockProvider
from atoms_agents.src.models.providers.bedrock.bedrock_claude_3_7_opus import Claude37OpusBedrockProvider
from atoms_agents.src.models.providers.bedrock.bedrock_claude_3_7_sonnet import Claude37SonnetBedrockProvider
from atoms_agents.src.models.providers.bedrock.bedrock_cohere_command_light import CohereCommandLightBedrockProvider
from atoms_agents.src.models.providers.bedrock.bedrock_cohere_command_plus import CohereCommandPlusBedrockProvider
from atoms_agents.src.models.providers.bedrock.bedrock_jurassic_2_ultra import Jurassic2UltraBedrockProvider
from atoms_agents.src.models.providers.bedrock.bedrock_llama_2_13b import Llama213BedrockProvider
from atoms_agents.src.models.providers.bedrock.bedrock_llama_2_70b import Llama270BedrockProvider
from atoms_agents.src.models.providers.bedrock.bedrock_mistral_7b import Mistral7BBedrockProvider
from atoms_agents.src.models.providers.bedrock.bedrock_mistral_large import MistralLargeBedrockProvider
from atoms_agents.src.models.providers.bedrock.bedrock_titan_image_generator import TitanImageGeneratorBedrockProvider
from atoms_agents.src.models.providers.bedrock.bedrock_titan_text_express import TitanTextExpressBedrockProvider
from atoms_agents.src.models.providers.google.gemini_2_5_flash import Gemini25FlashProvider
from atoms_agents.src.models.providers.google.gemini_2_5_flash_lite import Gemini25FlashLiteProvider
from atoms_agents.src.models.providers.google.gemini_2_5_pro import Gemini25ProProvider
from atoms_agents.src.models.providers.google.gemini_3_flash import Gemini3FlashProvider
from atoms_agents.src.models.providers.google.gemini_3_pro import Gemini3ProProvider
from atoms_agents.src.models.providers.google.imagen_3 import Imagen3Provider
from atoms_agents.src.models.providers.google.lyria import LyriaProvider
from atoms_agents.src.models.providers.google.veo import VeoProvider
from atoms_agents.src.models.providers.openai.gpt_4_1 import GPT41Provider
from atoms_agents.src.models.providers.openai.gpt_5_2 import GPT52Provider
from atoms_agents.src.models.providers.openai.gpt_5_2_codex import GPT52CodexProvider
from atoms_agents.src.models.providers.openai.gpt_5_2_pro import GPT52ProProvider
from atoms_agents.src.models.providers.openai.gpt_5_mini import GPT5MiniProvider
from atoms_agents.src.models.providers.openai.gpt_5_nano import GPT5NanoProvider
from atoms_agents.src.models.providers.openai.gpt_image_1_5 import GPTImage15Provider
from atoms_agents.src.models.providers.openai.tts_1 import TTS1Provider
from atoms_agents.src.models.providers.openai.whisper_1 import Whisper1Provider

PROVIDER_REGISTRY: List[Type] = [
    GPT52Provider,
    GPT52ProProvider,
    GPT52CodexProvider,
    GPT5MiniProvider,
    GPT5NanoProvider,
    GPT41Provider,
    Whisper1Provider,
    TTS1Provider,
    GPTImage15Provider,
    Claude37OpusProvider,
    Claude37SonnetProvider,
    Claude37HaikuProvider,
    Claude36OpusProvider,
    Claude35SonnetProvider,
    ClaudeVisionProvider,
    ClaudeComputerUseProvider,
    Gemini3ProProvider,
    Gemini3FlashProvider,
    Gemini25ProProvider,
    Gemini25FlashProvider,
    Gemini25FlashLiteProvider,
    VeoProvider,
    LyriaProvider,
    Imagen3Provider,
    Claude37OpusBedrockProvider,
    Claude37SonnetBedrockProvider,
    Claude37HaikuBedrockProvider,
    Llama270BedrockProvider,
    Llama213BedrockProvider,
    Mistral7BBedrockProvider,
    MistralLargeBedrockProvider,
    Jurassic2UltraBedrockProvider,
    CohereCommandLightBedrockProvider,
    CohereCommandPlusBedrockProvider,
    TitanTextExpressBedrockProvider,
    TitanImageGeneratorBedrockProvider,
]

__all__ = ["PROVIDER_REGISTRY"]
