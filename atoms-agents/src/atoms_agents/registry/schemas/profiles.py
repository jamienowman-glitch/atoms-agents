from dataclasses import dataclass

@dataclass
class RunProfileCard:
    profile_id: str
    name: str
    persistence_backend: str  # local | infra
    blackboard_backend: str   # local | infra
    pii_strategy: str         # passthrough | infra
    nexus_strategy: str       # disabled | infra
    allow_local_fallback: bool
    description: str = ""
    notes: str = ""
    card_type: str = "profile"
