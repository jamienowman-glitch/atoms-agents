from dataclasses import dataclass
from typing import Optional, Any

@dataclass
class ArtifactRef:
    id: str
    type: str # e.g. "image/png", "text/plain", "file"
    uri: str
    metadata: Optional[dict[str, Any]] = None
