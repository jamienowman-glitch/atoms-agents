"""EventV2 Logging Integration for Atoms Agents

This module integrates with the EventV2 standard to ensure all providers,
frameworks, and capabilities emit proper event envelopes to the canvas.

Key Responsibilities:
- Wrap all provider/framework/capability invocations with EventV2 envelopes
- Route events to Supabase event_v2_logs table
- Emit SSE events for canvas state changes
- Emit WS events for chat rail communication
- Handle media sidecars (NO raw bytes - only URIs)
"""

import asyncio
import json
import logging
import uuid
from dataclasses import dataclass, asdict
from datetime import datetime, timezone
from enum import Enum
from typing import Any, Dict, List, Optional, Union

from pydantic import BaseModel, Field

# ============================================
# EVENT V2 CONTRACT TYPES
# ============================================


class ActorType(str, Enum):
    """Actor types for event attribution."""
    HUMAN = "human"
    AGENT = "agent"
    SYSTEM = "system"


class EventPriority(str, Enum):
    """Event priority levels."""
    TRUTH = "truth"  # Authoritative state commits (SSE)
    GESTURE = "gesture"  # Ephemeral (WS - chat typing, presence)
    INFO = "info"  # Notifications
    CRITICAL = "critical"  # Errors/interrupts


class EventSeverity(str, Enum):
    """Severity levels."""
    DEBUG = "debug"
    INFO = "info"
    WARN = "warn"
    ERROR = "error"


class PersistPolicy(str, Enum):
    """Persistence policies."""
    ALWAYS = "always"
    SAMPLED = "sampled"
    NEVER = "never"


class StorageClass(str, Enum):
    """Storage classification."""
    STREAM = "stream"  # Real-time stream
    LOG = "log"  # Historical log


# ============================================
# ROUTING KEYS (Required for all events)
# ============================================


class RoutingKeys(BaseModel):
    """Mandatory routing keys for SSE/WS routing."""
    tenant_id: str = Field(..., description="Tenant ID (t_xxx format)")
    project_id: str = Field(..., description="Project ID")
    actor_id: str = Field(..., description="Agent or user ID")
    actor_type: ActorType = Field(..., description="Human/Agent/System")
    canvas_id: Optional[str] = None  # For canvas state events
    thread_id: Optional[str] = None  # For chat rail events
    session_id: Optional[str] = None  # Session identifier
    device_id: Optional[str] = None  # Device identifier


# ============================================
# MEDIA SIDECARS (NO raw bytes)
# ============================================


class MediaSidecar(BaseModel):
    """Reference to media (never raw bytes or data URIs)."""
    uri: Optional[str] = None  # s3://, artifact://, etc
    object_id: Optional[str] = None  # Supabase object ID
    artifact_id: Optional[str] = None  # Artifact storage ID
    mime_type: Optional[str] = None
    size_bytes: Optional[int] = None
    checksum: Optional[str] = None

    def __init__(self, **data):
        super().__init__(**data)
        # Validate: at least one reference required
        if not (self.uri or self.object_id or self.artifact_id):
            raise ValueError("MediaSidecar requires uri, object_id, or artifact_id")
        
        # Validate: NO data URIs or base64
        if self.uri:
            if self.uri.startswith("data:") or "base64" in self.uri.lower():
                raise ValueError("data: URIs and base64 forbidden in media sidecars")


# ============================================
# EVENT V2 ENVELOPE
# ============================================


class EventV2(BaseModel):
    """The canonical EventV2 envelope for all agent events."""
    
    # Version
    v: int = 1
    
    # Event identity
    event_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    correlation_id: Optional[str] = None
    request_id: Optional[str] = None
    run_id: Optional[str] = None
    step_id: Optional[str] = None
    
    # Event type (e.g., 'model_inference', 'framework_start', 'capability_invoked')
    type: str
    
    # Routing
    routing: RoutingKeys
    
    # Metadata
    ts: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    seq: Optional[int] = None
    priority: EventPriority = EventPriority.INFO
    persist_policy: PersistPolicy = PersistPolicy.ALWAYS
    severity: EventSeverity = EventSeverity.INFO
    storage_class: StorageClass = StorageClass.STREAM
    
    # Payload
    payload: Dict[str, Any] = Field(default_factory=dict)
    media_sidecars: List[MediaSidecar] = Field(default_factory=list)
    
    # Schema
    schema_version: str = "1.0.0"


# ============================================
# EVENT V2 LOGGER
# ============================================


class EventV2Logger:
    """Centralized EventV2 logging for all agents, providers, frameworks."""
    
    def __init__(
        self,
        tenant_id: str,
        project_id: str,
        supabase_client: Optional[Any] = None,
        transport_client: Optional[Any] = None,
    ):
        """Initialize EventV2 logger.
        
        Args:
            tenant_id: Tenant identifier
            project_id: Project identifier
            supabase_client: Supabase client for persisting logs
            transport_client: CanvasTransport client for real-time emission
        """
        self.tenant_id = tenant_id
        self.project_id = project_id
        self.supabase_client = supabase_client
        self.transport_client = transport_client
        self.logger = logging.getLogger("EventV2Logger")
    
    def create_routing_keys(
        self,
        actor_id: str,
        actor_type: ActorType = ActorType.AGENT,
        canvas_id: Optional[str] = None,
        thread_id: Optional[str] = None,
        session_id: Optional[str] = None,
        device_id: Optional[str] = None,
    ) -> RoutingKeys:
        """Create RoutingKeys for an event."""
        return RoutingKeys(
            tenant_id=self.tenant_id,
            project_id=self.project_id,
            actor_id=actor_id,
            actor_type=actor_type,
            canvas_id=canvas_id,
            thread_id=thread_id,
            session_id=session_id,
            device_id=device_id,
        )
    
    def create_event(
        self,
        event_type: str,
        routing: RoutingKeys,
        payload: Dict[str, Any],
        priority: EventPriority = EventPriority.INFO,
        severity: EventSeverity = EventSeverity.INFO,
        media_sidecars: Optional[List[MediaSidecar]] = None,
        correlation_id: Optional[str] = None,
        request_id: Optional[str] = None,
    ) -> EventV2:
        """Create an EventV2 envelope.
        
        Args:
            event_type: Type of event (e.g., 'model_inference')
            routing: RoutingKeys for this event
            payload: Event payload data
            priority: Event priority level
            severity: Severity level
            media_sidecars: Media references (NO raw bytes)
            correlation_id: Correlation ID for tracing
            request_id: Request ID for tracing
        
        Returns:
            EventV2 envelope ready to emit
        """
        return EventV2(
            type=event_type,
            routing=routing,
            payload=payload,
            priority=priority,
            severity=severity,
            persist_policy=PersistPolicy.ALWAYS if priority == EventPriority.TRUTH else PersistPolicy.SAMPLED,
            media_sidecars=media_sidecars or [],
            correlation_id=correlation_id,
            request_id=request_id,
        )
    
    async def emit_event(
        self,
        event: EventV2,
        emit_to_sse: bool = True,
        emit_to_ws: bool = False,
        persist_to_db: bool = True,
    ) -> None:
        """Emit an event to configured channels.
        
        Args:
            event: EventV2 envelope to emit
            emit_to_sse: Emit to SSE stream (truth/canvas state)
            emit_to_ws: Emit to WS stream (gestures/chat)
            persist_to_db: Persist to Supabase event_v2_logs table
        """
        try:
            event_dict = json.loads(event.model_dump_json())
            
            # Emit to SSE (canvas state truth)
            if emit_to_sse and self.transport_client:
                try:
                    await self.transport_client.emit_sse(
                        canvas_id=event.routing.canvas_id,
                        event_data=event_dict,
                    )
                except Exception as e:
                    self.logger.error(f"Failed to emit SSE event: {e}")
            
            # Emit to WS (chat rail - fast like WhatsApp)
            if emit_to_ws and self.transport_client:
                try:
                    await self.transport_client.emit_ws(
                        thread_id=event.routing.thread_id,
                        event_data=event_dict,
                    )
                except Exception as e:
                    self.logger.error(f"Failed to emit WS event: {e}")
            
            # Persist to Supabase
            if persist_to_db and self.supabase_client:
                try:
                    await self._persist_event(event)
                except Exception as e:
                    self.logger.error(f"Failed to persist event to DB: {e}")
        
        except Exception as e:
            self.logger.error(f"Error emitting event: {e}")
    
    async def _persist_event(self, event: EventV2) -> None:
        """Persist event to Supabase event_v2_logs table."""
        record = {
            "id": str(uuid.uuid4()),
            "event_id": event.event_id,
            "tenant_id": event.routing.tenant_id,
            "actor_id": event.routing.actor_id,
            "actor_type": event.routing.actor_type.value,
            "event_type": event.type,
            "payload": event.payload,
            "routing_keys": event.routing.model_dump(),
            "event_priority": event.priority.value,
            "persist_policy": event.persist_policy.value,
            "timestamp": event.ts.isoformat(),
        }
        
        await asyncio.to_thread(
            self.supabase_client.table("event_v2_logs").insert,
            record,
        )


# ============================================
# PROVIDER EVENT WRAPPER
# ============================================


async def log_provider_inference(
    logger: EventV2Logger,
    provider_id: str,
    model_id: str,
    input_text: Optional[str] = None,
    output_text: Optional[str] = None,
    tokens_used: int = 0,
    cost: float = 0.0,
    media_sidecars: Optional[List[MediaSidecar]] = None,
    error: Optional[str] = None,
    actor_id: str = "system",
    canvas_id: Optional[str] = None,
) -> EventV2:
    """Log a provider model inference event.
    
    Args:
        logger: EventV2Logger instance
        provider_id: Provider ID (e.g., 'prov_openai')
        model_id: Model ID (e.g., 'model_gpt4o')
        input_text: Input prompt/query
        output_text: Model output
        tokens_used: Token count
        cost: USD cost
        media_sidecars: Media references
        error: Error message if failed
        actor_id: Actor ID
        canvas_id: Canvas ID for SSE routing
    
    Returns:
        EventV2 envelope logged
    """
    routing = logger.create_routing_keys(
        actor_id=actor_id,
        canvas_id=canvas_id,
    )
    
    payload = {
        "provider_id": provider_id,
        "model_id": model_id,
        "input_text": input_text,
        "output_text": output_text,
        "tokens_used": tokens_used,
        "cost": cost,
        "error": error,
    }
    
    severity = EventSeverity.ERROR if error else EventSeverity.INFO
    priority = EventPriority.TRUTH if not error else EventPriority.CRITICAL
    
    event = logger.create_event(
        event_type="model_inference",
        routing=routing,
        payload=payload,
        priority=priority,
        severity=severity,
        media_sidecars=media_sidecars or [],
    )
    
    await logger.emit_event(event, emit_to_sse=True, persist_to_db=True)
    return event


# ============================================
# FRAMEWORK EVENT WRAPPER
# ============================================


async def log_framework_execution(
    logger: EventV2Logger,
    framework_id: str,
    framework_mode_id: str,
    agent_persona_id: Optional[str] = None,
    models_used: Optional[List[str]] = None,
    capabilities_used: Optional[List[str]] = None,
    duration_ms: float = 0.0,
    status: str = "success",
    error: Optional[str] = None,
    actor_id: str = "system",
    canvas_id: Optional[str] = None,
) -> EventV2:
    """Log a framework execution event.
    
    Args:
        logger: EventV2Logger instance
        framework_id: Framework ID
        framework_mode_id: Mode ID
        agent_persona_id: Persona ID if applicable
        models_used: List of model IDs used
        capabilities_used: List of capability IDs used
        duration_ms: Execution duration in milliseconds
        status: 'success', 'failed', 'pending'
        error: Error message if failed
        actor_id: Actor ID
        canvas_id: Canvas ID for routing
    
    Returns:
        EventV2 envelope logged
    """
    routing = logger.create_routing_keys(
        actor_id=actor_id,
        canvas_id=canvas_id,
    )
    
    payload = {
        "framework_id": framework_id,
        "framework_mode_id": framework_mode_id,
        "agent_persona_id": agent_persona_id,
        "models_used": models_used or [],
        "capabilities_used": capabilities_used or [],
        "duration_ms": duration_ms,
        "status": status,
        "error": error,
    }
    
    severity = EventSeverity.ERROR if error else EventSeverity.INFO
    priority = EventPriority.TRUTH
    
    event = logger.create_event(
        event_type="framework_execution",
        routing=routing,
        payload=payload,
        priority=priority,
        severity=severity,
    )
    
    await logger.emit_event(event, emit_to_sse=True, persist_to_db=True)
    return event


# ============================================
# CAPABILITY EVENT WRAPPER
# ============================================


async def log_capability_invocation(
    logger: EventV2Logger,
    capability_id: str,
    input_data: Dict[str, Any],
    output_data: Optional[Dict[str, Any]] = None,
    duration_ms: float = 0.0,
    media_sidecars: Optional[List[MediaSidecar]] = None,
    error: Optional[str] = None,
    actor_id: str = "system",
    canvas_id: Optional[str] = None,
) -> EventV2:
    """Log a capability invocation event.
    
    Args:
        logger: EventV2Logger instance
        capability_id: Capability ID
        input_data: Input to capability
        output_data: Output from capability
        duration_ms: Execution time
        media_sidecars: Media references
        error: Error message if failed
        actor_id: Actor ID
        canvas_id: Canvas ID for routing
    
    Returns:
        EventV2 envelope logged
    """
    routing = logger.create_routing_keys(
        actor_id=actor_id,
        canvas_id=canvas_id,
    )
    
    payload = {
        "capability_id": capability_id,
        "input_data": input_data,
        "output_data": output_data,
        "duration_ms": duration_ms,
        "error": error,
    }
    
    severity = EventSeverity.ERROR if error else EventSeverity.INFO
    priority = EventPriority.TRUTH if not error else EventPriority.CRITICAL
    
    event = logger.create_event(
        event_type="capability_invoked",
        routing=routing,
        payload=payload,
        priority=priority,
        severity=severity,
        media_sidecars=media_sidecars or [],
    )
    
    await logger.emit_event(event, emit_to_sse=True, persist_to_db=True)
    return event


# ============================================
# CHAT RAIL EVENT WRAPPER (for WS - fast like WhatsApp)
# ============================================


async def log_chat_message(
    logger: EventV2Logger,
    message_text: str,
    sender_id: str,
    sender_type: ActorType = ActorType.AGENT,
    thread_id: Optional[str] = None,
    media_sidecars: Optional[List[MediaSidecar]] = None,
) -> EventV2:
    """Log a chat rail message (uses WS for speed).
    
    Args:
        logger: EventV2Logger instance
        message_text: Chat message
        sender_id: Sender ID
        sender_type: Sender type (human/agent)
        thread_id: Thread/conversation ID
        media_sidecars: Media references
    
    Returns:
        EventV2 envelope logged
    """
    routing = logger.create_routing_keys(
        actor_id=sender_id,
        actor_type=sender_type,
        thread_id=thread_id,
    )
    
    payload = {
        "message": message_text,
        "sender_id": sender_id,
        "sender_type": sender_type.value,
        "thread_id": thread_id,
    }
    
    event = logger.create_event(
        event_type="chat_message",
        routing=routing,
        payload=payload,
        priority=EventPriority.GESTURE,  # Ephemeral/fast
        severity=EventSeverity.INFO,
        media_sidecars=media_sidecars or [],
    )
    
    # Emit to WS (fast chat) instead of SSE
    await logger.emit_event(event, emit_to_sse=False, emit_to_ws=True, persist_to_db=True)
    return event


# ============================================
# CANVAS STATE EVENT (SSE Truth)
# ============================================


async def log_canvas_state_change(
    logger: EventV2Logger,
    canvas_id: str,
    previous_state: Dict[str, Any],
    new_state: Dict[str, Any],
    actor_id: str = "system",
) -> EventV2:
    """Log a canvas state change (SSE truth).
    
    Args:
        logger: EventV2Logger instance
        canvas_id: Canvas ID
        previous_state: Previous canvas state
        new_state: New canvas state
        actor_id: Actor ID
    
    Returns:
        EventV2 envelope logged
    """
    routing = logger.create_routing_keys(
        actor_id=actor_id,
        canvas_id=canvas_id,
    )
    
    payload = {
        "canvas_id": canvas_id,
        "previous_state": previous_state,
        "new_state": new_state,
    }
    
    event = logger.create_event(
        event_type="canvas_state_change",
        routing=routing,
        payload=payload,
        priority=EventPriority.TRUTH,  # Authoritative
        severity=EventSeverity.INFO,
    )
    
    # Emit to SSE (canvas truth)
    await logger.emit_event(event, emit_to_sse=True, emit_to_ws=False, persist_to_db=True)
    return event


if __name__ == "__main__":
    # Example usage
    logger = EventV2Logger(
        tenant_id="t_example",
        project_id="proj_123",
    )
    
    # Create routing keys
    routing = logger.create_routing_keys(
        actor_id="agent_editor_001",
        actor_type=ActorType.AGENT,
        canvas_id="canvas_001",
    )
    
    print("EventV2 Logger initialized and ready.")
    print(f"Tenant: {logger.tenant_id}, Project: {logger.project_id}")
