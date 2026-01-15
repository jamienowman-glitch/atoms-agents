from dataclasses import dataclass
from typing import List

@dataclass
class ProviderConfigCard:
    provider_id: str  # e.g. "azure_openai", "bedrock"
    name: str # e.g. "Azure OpenAI"
    required_fields: List[str] # e.g. ["azure_endpoint", "azure_deployment"]
    notes: str = ""
    card_type: str = "provider"

@dataclass
class ModelCard:
    model_id: str
    provider_id: str
    model_or_deployment_id: str # Renamed from official_id_or_deployment
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

    # Backwards compatibility property if needed, or we just update usages
    @property
    def official_id_or_deployment(self) -> str:
        return self.model_or_deployment_id
