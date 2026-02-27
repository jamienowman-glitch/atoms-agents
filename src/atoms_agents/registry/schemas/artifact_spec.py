from dataclasses import dataclass, field
from typing import Dict, List, Optional


@dataclass
class ArtifactSpecCard:
    artifact_spec_id: str
    name: str
    artifact_kind: str
    mime_type: Optional[str] = None
    required_fields: List[str] = field(default_factory=list)
    max_bytes: Optional[int] = None
    viewer_hints: Dict[str, str] = field(default_factory=dict)
    notes: str = ""
    card_type: str = "artifact_spec"

