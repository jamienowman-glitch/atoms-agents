from dataclasses import dataclass, field
from typing import List, Optional

@dataclass
class ProviderConfigCard:
    provider_id: str  # e.g. "azure_openai", "bedrock"
    name: str # e.g. "Azure OpenAI"
    required_fields: List[str] # e.g. ["azure_endpoint", "azure_deployment"]
    notes: str = ""
    card_type: str = "provider"

@dataclass
class ModelFamilyCard:
    family_id: str
    name: str
    description: str = ""
    provider_ids: List[str] = field(default_factory=list) # Which providers host this family
    card_type: str = "model_family"

@dataclass
class ModelCard:
    model_id: str
    provider_id: str
    official_id: str
    family_id: str

    # Atomic Fields
    version: str = "" # e.g. "3.5", "4"
    variant: str = "" # e.g. "sonnet", "turbo"
    reasoning_effort: str = "medium" # low | medium | high | o1-level
    context_window: int = 0

    # Technical Fields
    platform_api_surface: str = ""
    invocation_primitive: str = ""
    request_shape_minimal: str = ""
    streaming_support: str = "none" # none | token | bidirectional
    credential_discovery: str = ""
    region_or_project_discovery: str = ""
    default_creds_ok: bool = False
    docs_url: str = ""
    last_updated_or_version: str = ""
    confidence: str = "experimental"
    notes: str = ""
    card_type: str = "model"

    # Backward compatibility properties
    @property
    def model_or_deployment_id(self) -> str:
        return self.official_id

    @property
    def official_id_or_deployment(self) -> str:
        return self.official_id
