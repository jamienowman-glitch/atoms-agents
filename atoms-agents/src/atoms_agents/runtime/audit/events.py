from dataclasses import dataclass, field
from enum import Enum
from typing import Dict, Any, Optional
from datetime import datetime
import uuid


class EventType(str, Enum):
    RUN_START = "RUN_START"
    RUN_END = "RUN_END"
    NODE_START = "NODE_START"
    NODE_END = "NODE_END"
    TOOL_USE = "TOOL_USE"
    LLM_CALL = "LLM_CALL"
    ERROR = "ERROR"
    POLICY_VIOLATION = "POLICY_VIOLATION"
    AUDIT_LOG = "AUDIT_LOG"


@dataclass
class AuditEvent:
    event_type: EventType
    run_id: str
    timestamp: str = field(default_factory=lambda: datetime.utcnow().isoformat())
    event_id: str = field(default_factory=lambda: str(uuid.uuid4()))
    tenant_id: Optional[str] = None
    mode: Optional[str] = None
    project_id: Optional[str] = None
    request_id: Optional[str] = None
    trace_id: Optional[str] = None
    step_id: Optional[str] = None
    app_id: Optional[str] = None
    surface_id: Optional[str] = None
    actor: Optional[str] = None  # User ID or System
    node_id: Optional[str] = None
    payload: Dict[str, Any] = field(default_factory=dict)

    # Spine-Sync / StreamEvent Alignment
    atom_metadata: Optional[Dict[str, Any]] = None
    media_payload: Optional[Dict[str, Any]] = None
    canvas_type: Optional[str] = None
    pii_stripped: bool = False

    def to_dict(self) -> Dict[str, Any]:
        return {
            "timestamp": self.timestamp,
            "event_id": self.event_id,
            "run_id": self.run_id,
            "event_type": self.event_type.value,
            "tenant_id": self.tenant_id,
            "mode": self.mode,
            "project_id": self.project_id,
            "request_id": self.request_id,
            "trace_id": self.trace_id,
            "step_id": self.step_id,
            "app_id": self.app_id,
            "surface_id": self.surface_id,
            "actor": self.actor,
            "node_id": self.node_id,
            "payload": self.payload,
            "atom_metadata": self.atom_metadata,
            "media_payload": self.media_payload,
            "canvas_type": self.canvas_type,
            "pii_stripped": self.pii_stripped,
        }
