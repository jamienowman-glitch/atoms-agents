from dataclasses import dataclass, field
from typing import Any, Dict
from datetime import datetime, timezone
import uuid

@dataclass
class Event:
    type: str
    source: str
    payload: Dict[str, Any] = field(default_factory=dict)
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    timestamp: datetime = field(default_factory=lambda: datetime.now(timezone.utc))

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "type": self.type,
            "source": self.source,
            "payload": self.payload,
            "timestamp": self.timestamp.isoformat()
        }
