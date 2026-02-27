from dataclasses import dataclass, field
from typing import List, Optional


@dataclass
class ProviderConfigCard:
    provider_id: str  # e.g. "azure_openai", "openrouter"
    name: str  # e.g. "Azure OpenAI"

    # Minimal fields used by the RegistryLoader / UI.
    required_fields: List[str] = field(default_factory=list)  # e.g. ["azure_endpoint", "azure_deployment"]

    # Optional metadata for gateways/tooling (kept on-card, not hardcoded in Python).
    provider_type: str = ""  # api | local_lib | virtual
    api_base_url: Optional[str] = None
    description: str = ""
    python_module: str = ""
    env_var_keys: List[str] = field(default_factory=list)  # e.g. ["OPENROUTER_API_KEY"]
    notes: str = ""
    card_type: str = "provider"

