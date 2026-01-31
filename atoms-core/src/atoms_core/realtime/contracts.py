"""Canonical Realtime Event Contracts (REALTIME_SPEC_V1)."""
from __future__ import annotations

import uuid
from datetime import datetime, timezone
from enum import Enum
from typing import Any, Dict, List, Literal, Optional, Union

from pydantic import BaseModel, Field, root_validator, validator

# --- Routing Keys ---

class ActorType(str, Enum):
    HUMAN = "human"
    AGENT = "agent"
    SYSTEM = "system"


class RoutingKeys(BaseModel):
    """
    Mandatory routing keys for all StreamEvent envelopes.
    """
    tenant_id: str = Field(..., pattern=r"^t_[a-z0-9_-]+$")
    mode: Optional[str] = None
    env: Literal["dev", "staging", "prod", "stage"] = "dev"
    # Hierarchy
    workspace_id: Optional[str] = None
    project_id: str = Field(..., min_length=1)
    app_id: Optional[str] = None
    # Surface
    surface_id: Optional[str] = None
    canvas_id: Optional[str] = None
    projection_id: Optional[str] = None
    panel_id: Optional[str] = None
    thread_id: Optional[str] = None
    # Actor
    actor_id: str
    actor_type: ActorType
    session_id: Optional[str] = None
    device_id: Optional[str] = None


# --- IDs ---

class EventIds(BaseModel):
    request_id: Optional[str] = None
    correlation_id: Optional[str] = None
    run_id: Optional[str] = None
    step_id: Optional[str] = None


# --- Priority & Meta ---

class EventPriority(str, Enum):
    TRUTH = "truth"  # Authoritative commits
    GESTURE = "gesture"  # Ephemeral (mouse, typing)
    INFO = "info"  # Notifications/Chat
    CRITICAL = "critical"  # Severe errors/interrupts


class PersistPolicy(str, Enum):
    ALWAYS = "always"
    SAMPLED = "sampled"
    NEVER = "never"


class EventSeverity(str, Enum):
    INFO = "info"
    # Ported minimal enum to avoid dependency
    DEBUG = "debug"
    WARN = "warn"
    ERROR = "error"


class StorageClass(str, Enum):
    STREAM = "stream"
    LOG = "log"


class EventMeta(BaseModel):
    schema_ver: Optional[str] = None
    priority: EventPriority = EventPriority.INFO
    persist: PersistPolicy = PersistPolicy.ALWAYS
    last_event_id: Optional[str] = None
    schema_version: str = "1.0.0"
    severity: EventSeverity = Field(default=EventSeverity.INFO)
    storage_class: StorageClass = Field(default=StorageClass.STREAM)


# --- Payload Helpers ---

class MediaSidecar(BaseModel):
    """
    Sidecar reference for media payloads (URLs, object IDs, artifacts).
    Raw bytes or data URIs are explicitly rejected.
    """
    uri: Optional[str] = None
    object_id: Optional[str] = None
    artifact_id: Optional[str] = None
    mime_type: Optional[str] = None
    size_bytes: Optional[int] = None
    checksum: Optional[str] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)

    @root_validator(skip_on_failure=True)
    def _require_reference(cls, values: dict[str, Any]) -> dict[str, Any]:
        uri = values.get("uri")
        object_id = values.get("object_id")
        artifact_id = values.get("artifact_id")
        if not (uri or object_id or artifact_id):
            raise ValueError("media sidecar requires uri, object_id, or artifact_id")
        
        # Reject base64 and data URIs (REALTIME_SPEC_V1 §1.5)
        if uri:
            if uri.startswith("data:"):
                raise ValueError("data: URIs are forbidden in media sidecars; use durable references (s3://, artifact_id, etc.)")
            if uri.startswith("base64,") or "base64" in uri.lower():
                raise ValueError("base64-encoded content is forbidden in media sidecars")
        
        return values


class MediaPayload(BaseModel):
    sidecars: List[MediaSidecar] = Field(default_factory=list)
    caption: Optional[str] = None
    atom_metadata: Dict[str, Any] = Field(default_factory=dict)


class AtomMetadataPayload(BaseModel):
    atom_id: str
    atom_revision: Optional[Union[str, int]] = None
    atom_metadata: Dict[str, Any] = Field(default_factory=dict)
    media_payload: Optional[MediaPayload] = None
    surface_id: Optional[str] = None
    canvas_id: Optional[str] = None
    projection_id: Optional[str] = None
    panel_id: Optional[str] = None


# --- Canonical StreamEvent ---

class StreamEvent(BaseModel):
    """
    The Single Source of Truth event envelope.
    """
    v: int = 1
    type: str  # e.g. "token_chunk", "canvas_commit", "presence_state"
    ts: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    seq: Optional[int] = None  # Monotonic sequence per stream key
    event_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    trace_id: Optional[str] = None
    span_id: Optional[str] = None

    ids: EventIds = Field(default_factory=EventIds)
    routing: RoutingKeys
    data: Dict[str, Any] = Field(default_factory=dict)
    atom_metadata: Dict[str, Any] = Field(default_factory=dict)
    media_payload: Optional[MediaPayload] = None
    meta: EventMeta = Field(default_factory=EventMeta)

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }


# --- Chat Types (Merged) ---

class Contact(BaseModel):
    id: str
    display_name: Optional[str] = None
    handle: Optional[str] = None


class Message(BaseModel):
    id: str
    thread_id: str
    sender: Contact
    text: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    role: str = "user"  # user | agent | system
    scope: Optional[Dict[str, Any]] = None


# --- Event Type Constants (REALTIME_SPEC_V1 §1.7) ---

class EventType:
    """Canonical event type constants."""
    # Downstream (SSE)
    CANVAS_READY = "CANVAS_READY"
    TOKEN_PATCH = "token_patch"
    STATE_PATCH = "state_patch"
    CANVAS_COMMIT = "canvas_commit"
    SNAPSHOT_CREATED = "snapshot_created"
    CHAT_TOKEN = "chat_token"
    LOG_LINE = "log_line"
    
    # Presence/Ephemeral
    PRESENCE_STATE = "presence_state"
    GESTURE = "gesture"
    
    # Legacy/Chat
    USER_MESSAGE = "user_message"
    AGENT_MESSAGE = "agent_message"
    RESUME_CURSOR = "resume_cursor"


# --- Command Envelope (Upstream) ---

class CommandEnvelope(BaseModel):
    """
    Upstream command envelope (HTTP/WS).
    Commands are idempotent, typed, and scoped by routing.
    """
    command_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    command_type: str  # e.g. "canvas.atom.create", "chat.send"
    routing: RoutingKeys
    payload: Dict[str, Any] = Field(default_factory=dict)
    idempotency_key: Optional[str] = None
    ts: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# --- Event Envelope (Downstream) ---

class EventEnvelope(BaseModel):
    """
    Generic downstream event wrapper.
    Alias for StreamEvent with stricter typing.
    """
    event: StreamEvent
    

class DatasetEvent(BaseModel):
    """
    Event carrying dataset/artifact references.
    Used for snapshot_created, artifact uploads, etc.
    """
    event_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    event_type: str = EventType.SNAPSHOT_CREATED
    routing: RoutingKeys
    dataset_id: Optional[str] = None
    artifact_refs: List[MediaSidecar] = Field(default_factory=list)
    metadata: Dict[str, Any] = Field(default_factory=dict)
    ts: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
