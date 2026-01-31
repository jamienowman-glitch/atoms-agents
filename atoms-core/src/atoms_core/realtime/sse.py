"""Authenticated SSE transport wired to the unified timeline."""
from __future__ import annotations

import asyncio
import logging
import uuid
from typing import AsyncGenerator, Optional

from fastapi import APIRouter, Header, Depends, HTTPException, Query, Request
from fastapi.responses import StreamingResponse

from src.identity.models import RequestContext
from src.identity.auth import AuthContext, get_optional_auth_context, assert_context_matches
from src.identity.tickets import context_from_ticket, TicketError
from src.realtime.contracts import (
    ActorType,
    EventIds,
    EventMeta,
    EventPriority,
    PersistPolicy,
    RoutingKeys,
    StreamEvent,
    Contact, 
    Message,
)
from src.realtime.timeline import get_timeline_service, build_stream_id
from src.realtime.contracts import EventType

router = APIRouter()
logger = logging.getLogger(__name__)


def _format_sse_event(event: StreamEvent) -> str:
    payload = event.model_dump_json() # pydantic v2 or use .json() if v1
    # Clean newlines to prevent SSE breakage
    payload_clean = payload.replace("\n", "")
    return f"id: {event.event_id}\nevent: {event.type}\ndata: {payload_clean}\n\n"


def _build_resume_event(thread_id: str, context: RequestContext, cursor: str) -> StreamEvent:
    routing = RoutingKeys(
        tenant_id=context.tenant_id,
        mode=context.mode,
        project_id=context.project_id,
        app_id=context.app_id,
        surface_id=context.surface_id,
        thread_id=thread_id,
        actor_id=context.user_id or "system",
        actor_type=ActorType.SYSTEM,
    )
    return StreamEvent(
        type="resume_cursor",
        event_id=f"resume-{cursor or uuid.uuid4().hex}",
        routing=routing,
        data={"cursor": cursor},
        ids=EventIds(
            request_id=context.request_id,
            run_id=thread_id,
            step_id="resume_cursor",
        ),
        trace_id=context.request_id,
        meta=EventMeta(
            priority=EventPriority.INFO,
            persist=PersistPolicy.NEVER,
            last_event_id=cursor,
        ),
    )


async def _timeline_stream_with_resume(
    stream_id: str,
    request_context: RequestContext,
    last_event_id: Optional[str],
) -> AsyncGenerator[str, None]:
    """
    Stream events from timeline with tenant isolation.
    Uses canonical stream_id (REALTIME_SPEC_V1 §2).
    """
    svc = get_timeline_service()
    
    # Tenant-scoped replay (REALTIME_SPEC_V1 §6)
    async for event in svc.stream_events(cursor=last_event_id):
        # Filter by stream_id and tenant
        event_stream_id = build_stream_id(event.routing)
        if event_stream_id != stream_id:
            continue
        
        if event.routing.tenant_id != request_context.tenant_id:
            continue
        
        yield _format_sse_event(event)


def _require_identity_header(value: Optional[str], header_name: str) -> None:
    if not value:
        raise HTTPException(status_code=400, detail=f"{header_name} header is required")


async def _sse_context(
    request: Request,
    ticket: Optional[str] = Query(default=None, alias="ticket"),
    authorization: Optional[str] = Header(default=None, alias="Authorization"),
) -> RequestContext:
    """
    Hardened identity resolution (REALTIME_SPEC_V1 §1.6).
    Requires ticket OR Authorization header. No query param fallback.
    """
    if ticket:
        try:
            return context_from_ticket(ticket)
        except TicketError as exc:
            raise HTTPException(status_code=401, detail=f"Invalid ticket: {exc}")
    
    if authorization:
        # TODO: Implement full JWT/Supabase auth via IdentityMiddleware
        # For now, reject if no ticket provided
        raise HTTPException(status_code=401, detail="Authorization header auth not yet implemented; use ticket")
    
    # No fallback to query params (REALTIME_SPEC_V1 hardening)
    raise HTTPException(status_code=401, detail="Authentication required: provide ticket query param or Authorization header")


@router.get("/sse/chat/{thread_id}")
async def sse_chat(
    thread_id: str,
    last_event_id: Optional[str] = Header(None, alias="Last-Event-ID"),
    query_last_event_id: Optional[str] = Query(None, alias="last_event_id"),
    request_context: RequestContext = Depends(_sse_context),
) -> StreamingResponse:
    """
    SSE endpoint for downstream truth (REALTIME_SPEC_V1 §1.3).
    """
    cursor = last_event_id or query_last_event_id
    
    # Build canonical stream_id (REALTIME_SPEC_V1 §2)
    routing = RoutingKeys(
        tenant_id=request_context.tenant_id,
        mode=request_context.mode,
        project_id=request_context.project_id,
        app_id=request_context.app_id,
        surface_id=request_context.surface_id,
        thread_id=thread_id,
        actor_id=request_context.user_id or "system",
        actor_type=ActorType.SYSTEM,
    )
    stream_id = build_stream_id(routing)
    
    return StreamingResponse(
        _timeline_stream_with_resume(
            stream_id=stream_id,
            request_context=request_context,
            last_event_id=cursor,
        ),
        media_type="text/event-stream",
    )


@router.post("/sse/chat/{thread_id}")
async def post_message(
    thread_id: str,
    request: Request,
    request_context: RequestContext = Depends(_sse_context),
):
    """
    POST endpoint for chat messages (REALTIME_SPEC_V1 §1.3).
    Appends to timeline (SSE = truth).
    """
    try:
        body = await request.json()
        text = body.get("text")
        sender_id = body.get("sender", {}).get("id")
    except:
        raise HTTPException(status_code=400, detail="Invalid JSON")

    if not text:
        raise HTTPException(status_code=400, detail="text required")

    routing = RoutingKeys(
        tenant_id=request_context.tenant_id,
        mode=request_context.mode,
        project_id=request_context.project_id,
        app_id=request_context.app_id,
        surface_id=request_context.surface_id,
        thread_id=thread_id,
        actor_id=sender_id or request_context.user_id or "anon",
        actor_type=ActorType.HUMAN,
    )
    
    event = StreamEvent(
        type=EventType.USER_MESSAGE,
        routing=routing,
        data={"text": text, "sender": {"id": sender_id}},
        ids=EventIds(
            request_id=request_context.request_id,
            run_id=thread_id,
            step_id=uuid.uuid4().hex,
        ),
        meta=EventMeta(priority=EventPriority.INFO, persist=PersistPolicy.ALWAYS),
    )
    
    # Use canonical stream_id (REALTIME_SPEC_V1 §2)
    stream_id = build_stream_id(routing)
    
    svc = get_timeline_service()
    await svc.append_event(event, request_context)
    
    return {"posted": [event.model_dump()]}
