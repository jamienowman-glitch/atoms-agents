from dataclasses import dataclass, field
from typing import Any, Dict, Optional


@dataclass(frozen=True)
class ActionEnvelope:
    action_name: str
    subject_type: str
    subject_id: str
    surface_id: Optional[str] = None
    app_id: Optional[str] = None
    payload: Dict[str, Any] = field(default_factory=dict)

    def to_json(self) -> Dict[str, Any]:
        data: Dict[str, Any] = {
            "action_name": self.action_name,
            "subject_type": self.subject_type,
            "subject_id": self.subject_id,
            "payload": dict(self.payload),
        }
        if self.surface_id is not None:
            data["surface_id"] = self.surface_id
        if self.app_id is not None:
            data["app_id"] = self.app_id
        return data
