from dataclasses import dataclass, field
from typing import Dict, Any, Optional

@dataclass
class ManifestCard:
    manifest_id: str
    name: str
    description: str
    system_prompt: str
    metadata: Dict[str, Any] = field(default_factory=dict)
