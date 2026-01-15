from dataclasses import dataclass, field
from enum import Enum
from typing import List, Dict, Any, Optional

class Vendor(str, Enum):
    OPENAI = "openai"
    GOOGLE = "google"
    ANTHROPIC = "anthropic"
    BEDROCK = "bedrock"
    ELEVENLABS = "elevenlabs"
    PERPLEXITY = "perplexity"
    DEEPGRAM = "deepgram"
    AZURE = "azure"
    AWS = "aws"
    RUNWAY = "runway"
    STABILITY = "stability"
    ADOBE = "adobe"
    PIKA = "pika"
    SELFHOSTED = "selfhosted"
    OPENSOURCE = "opensource"

@dataclass
class ModelSpec:
    vendor: Vendor
    model_id: str
    api_surface: str
    modalities_supported: List[str] = field(default_factory=list)
    default_params: Dict[str, Any] = field(default_factory=dict)
    cost_profile: str = "normal"  # cheap, normal, expensive
