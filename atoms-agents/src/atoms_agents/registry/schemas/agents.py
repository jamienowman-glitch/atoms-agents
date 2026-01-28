from dataclasses import dataclass, field
from typing import List, Optional

@dataclass
class AgentCard:
    agent_id: str
    name: str
    description: str
    manifest_ref: str
    persona_ref: str
    task_ref: str
    model_ref: str
    reasoning_ref: str
    firearms_license_ref: str
    framework_ref: Optional[str] = None
    framework_mode_ref: Optional[str] = None
    capability_refs: List[str] = field(default_factory=list)
