from dataclasses import dataclass, field
from typing import Dict, Any, Optional

@dataclass
class ReasoningProfileCard:
    reasoning_id: str
    name: str
    description: str = ""
    notes: str = ""
    request_overrides: Dict[str, Any] = field(default_factory=dict)
    provider_id: Optional[str] = None
