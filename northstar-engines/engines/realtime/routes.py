"""FastAPI routes for realtime timeline (Stream Event append-log)."""
from __future__ import annotations

from typing import Optional
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field

from engines.common.identity import RequestContext, RequestContextBuilder
from engines.realtime.contracts import StreamEvent, StreamEventRouting
from engines.realtime.timeline import _default_timeline_store
from engines.routing.manager import ForbiddenBackendClass

router = APIRouter(prefix="/realtime", tags=["realtime"])


# ===== Schemas =====

class StreamEventCreateRequest(BaseModel):
    """Schema for creating a stream event."""
    type: str = Field(..., description="Event type (e.g., message, system, activity)")
    stream_id: str = Field(..., description="Stream/thread identifier")
    content: Optional[str] = Field(None, description="Event content/payload")
    user_id: Optional[str] = Field(None, description="User who triggered event")
    metadata: Optional[dict] = Field(None, description="Additional metadata")


class StreamEventResponse(BaseModel):
    """Response schema for stream event operations."""
    event_id: str
    type: str
    stream_id: str
    timestamp: str
    content: Optional[str] = None
    user_id: Optional[str] = None
    metadata: Optional[dict] = None


# ===== Routes =====

@router.post("/timeline/{stream_id}/append", response_model=StreamEventResponse)
async def append_event(
    stream_id: str,
    req: StreamEventCreateRequest,
    context: RequestContext = Depends(RequestContextBuilder.from_request),
) -> dict:
    """Append a stream event to timeline.
    
    - Creates a new StreamEvent with unique event_id
    - Stores in timeline store (filesystem, memory, or Firestore)
    - Returns the created event
    
    NOTE: Backend-class guard enforced: filesystem backend forbidden in sellable modes (saas, enterprise, t_system).
    """
    try:
        timeline_store = _default_timeline_store()
        
        # Create event
        event = StreamEvent(
            event_id=str(uuid4()),
            type=req.type,
            stream_id=stream_id,
            content=req.content,
            user_id=req.user_id,
            metadata=req.metadata or {},
            routing=StreamEventRouting(
                tenant_id=context.tenant_id,
                project_id=context.project_id,
                env=context.env,
                mode=context.mode,
            ),
        )
        
        # Append to timeline - this will raise ForbiddenBackendClass if filesystem + sellable mode
        timeline_store.append(stream_id, event, context)
        
        return {
            "event_id": event.event_id,
            "type": event.type,
            "stream_id": event.stream_id,
            "timestamp": event.ts.isoformat() if event.ts else "",
            "content": event.content,
            "user_id": event.user_id,
            "metadata": event.metadata,
        }
    
    except ForbiddenBackendClass as e:
        raise HTTPException(
            status_code=403,
            detail=str(e),
        ) from e
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Timeline append failed: {str(e)}",
        ) from e


@router.get("/timeline/{stream_id}/list", response_model=list[StreamEventResponse])
async def list_events(
    stream_id: str,
    after_event_id: Optional[str] = Query(None, description="Return events after this ID (for SSE)"),
    context: RequestContext = Depends(RequestContextBuilder.from_request),
) -> list[dict]:
    """List stream events from timeline.
    
    - If after_event_id is provided, returns events after that ID (pagination)
    - Otherwise returns all events in chronological order
    
    NOTE: Backend-class guard enforced: filesystem backend forbidden in sellable modes.
    """
    try:
        timeline_store = _default_timeline_store()
        
        # List events - will raise ForbiddenBackendClass if filesystem + sellable mode
        events = timeline_store.list_after(stream_id, after_event_id)
        
        return [
            {
                "event_id": ev.event_id,
                "type": ev.type,
                "stream_id": ev.stream_id,
                "timestamp": ev.ts.isoformat() if ev.ts else "",
                "content": ev.content,
                "user_id": ev.user_id,
                "metadata": ev.metadata,
            }
            for ev in events
        ]
    
    except ForbiddenBackendClass as e:
        raise HTTPException(
            status_code=403,
            detail=str(e),
        ) from e
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Timeline list failed: {str(e)}",
        ) from e
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Timeline list failed: {str(e)}",
        ) from e


# ===== Feed Realtime Implementation (P0) =====
from sse_starlette.sse import EventSourceResponse
from engines.realtime.broadcaster import subscribe
from fastapi import WebSocket

@router.get("/feeds/{kind}/{feed_id}", tags=["feeds", "realtime"])
async def sse_feed_updates(
    kind: str,
    feed_id: str,
    context: RequestContext = Depends(RequestContextBuilder.from_request),
):
    """
    SSE Stream for feed updates.
    Target: GET /realtime/feeds/{kind}/{feed_id} (mapped from contract /sse/feeds...)
    """
    # Note: Contract says /sse/feeds/... implies a separate router or root mount.
    # Current router prefix is /realtime. 
    # Valid pattern: /realtime/feeds/sse/{kind}/{feed_id} or similar.
    # If strictly adhering to contract /sse/feeds, we might need to mount this router differently.
    # For P0, we expose it here as the functional endpoint.
    
    async def event_generator():
        # Yield connection event
        yield {
            "event": "connected",
            "data": "connected"
        }
        # Subscribe to broadcaster
        async for payload in subscribe(feed_id):
            yield {
                "event": payload["type"],
                "data": json.dumps(payload)
            }

    return EventSourceResponse(event_generator())

@router.websocket("/ws/feeds/{kind}/{feed_id}")
async def ws_feed_updates(
    websocket: WebSocket,
    kind: str,
    feed_id: str,
):
    """
    WebSocket Stub for feed updates.
    """
    await websocket.accept()
    # Stub implementation
    await websocket.send_json({"type": "connected", "msg": "WS Stub Active"})
    try:
        while True:
            # Echo or simple heartbeats
            data = await websocket.receive_text()
            await websocket.send_json({"type": "ack", "recv": data})
            # In real impl, we'd hook into 'subscribe' here too
    except Exception:
        pass
