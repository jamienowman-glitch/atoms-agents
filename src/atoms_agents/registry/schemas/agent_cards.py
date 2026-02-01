from dataclasses import dataclass, field
from typing import List, Optional, Dict, Any

@dataclass
class ReasoningProfileCard:
    profile_id: str
    name: str
    description: str
    method: str  # e.g., "cot", "tree_of_thought", "direct"
    parameters: Dict[str, Any] = field(default_factory=dict)
    card_type: str = "reasoning_profile"

@dataclass
class FirearmsLicenseCard:
    license_id: str
    holder: str
    clearance_level: str
    capabilities: List[str] = field(default_factory=list)
    expiry: Optional[str] = None
    card_type: str = "firearms_license"

@dataclass
class AgentCard:
    agent_id: str
    name: str
    description: str
    model_id: str
    persona_id: Optional[str] = None
    task_id: Optional[str] = None
    reasoning_profile_id: Optional[str] = None
    firearms_license_id: Optional[str] = None
    manifest_refs: List[str] = field(default_factory=list)
    meta: Dict[str, Any] = field(default_factory=dict)
    card_type: str = "agent"
