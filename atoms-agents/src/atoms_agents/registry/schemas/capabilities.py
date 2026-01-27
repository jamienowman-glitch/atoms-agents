from dataclasses import dataclass

@dataclass
class CapabilityCard:
    capability_id: str # e.g. "vision"
    capability_name: str # e.g. "Vision (Image Input)"
    description: str = ""
    embedded_or_separate: str = "EMBEDDED" # EMBEDDED | SEPARATE
    card_type: str = "capability"

@dataclass
class CapabilityBindingCard:
    binding_id: str # e.g. "bedrock_nova_pro_vision"
    provider_id: str
    model_or_deployment_id: str
    capability_id: str
    toggle_mechanism: str
    minimal_toggle_snippet: str
    streaming_support: str = "none"
    prereqs_or_allowlist: str = ""
    docs_url: str = ""
    last_updated_or_version: str = ""
    confidence: str = "experimental"
    notes: str = ""
    card_type: str = "capability_binding"
