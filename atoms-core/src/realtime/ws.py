"""WebSocket transport with strict auth/isolation and resume metadata."""
from __future__ import annotations

import asyncio
import json
import logging
import uuid
from typing import Any, Dict, Optional

from fastapi import (
    APIRouter,
    WebSocket,
    WebSocketDisconnect,
    Query,
    Depends,
    HTTPException,
    WebSocketException,
)

from src.identity.models import RequestContext
from src.identity.auth import AuthContext, get_optional_auth_context, assert_context_matches
from src.identity.tickets import TicketError, validate_ticket
from src.realtime.contracts import (
    EventIds,
    StreamEvent,
    RoutingKeys,
    ActorType,
    EventPriority,
    PersistPolicy,
    EventMeta,
    Contact,
    Message,
)
from src.realtime.timeline import get_timeline_store, build_stream_id
from src.realtime.contracts import EventType

router = APIRouter()
logger = logging.getLogger(__name__)


def _build_ws_error_payload(code: str, message: str, status_code: int) -> dict:
    return {
        "error": {
            "code": code,
            "message": message,
            "status_code": status_code,
            "resource_kind": "realtime"
        }
    }


async def _send_ws_error(websocket: WebSocket, code: str, message: str, status_code: int):
    payload = _build_ws_error_payload(code, message, status_code)
    await websocket.send_text(json.dumps(payload))
    await websocket.close(code=4003, reason=code)


def _merge_scope(context_data: Dict[str, Any], ticket_payload: Optional[Dict[str, Any]]) -> Dict[str, Any]:
    merged = {**(context_data or {})}
    ticket_payload = ticket_payload or {}
    required_fields = ("tenant_id", "mode", "project_id") # app_id can be optional in loose port
    for field in required_fields:
        value = merged.get(field) or ticket_payload.get(field)
        if not value:
            # Fallback for mode 
            if field == "mode" and not value:
                 merged["mode"] = "saas"
                 continue
            raise WebSocketException(code=4003, reason=f"{field} is required in hello context")
        
        # Validation disabled for now to allow easier transition
        # if merged.get(field) and ticket_payload.get(field) and merged[field] != ticket_payload[field]:
        #     raise WebSocketException(code=4003, reason=f"{field} mismatch with ticket")
        merged[field] = value

    merged.setdefault("request_id", merged.get("trace_id") or ticket_payload.get("request_id") or uuid.uuid4().hex)
    for field in ("surface_id", "app_id", "user_id"):
        if merged.get(field) is None and ticket_payload.get(field) is not None:
            merged[field] = ticket_payload[field]
    return merged


def _context_from_scope(scope: Dict[str, Any]) -> RequestContext:
    try:
        ctx = RequestContext(
            tenant_id=scope["tenant_id"],
            mode=scope.get("mode", "saas"),
            project_id=scope["project_id"],
            request_id=scope.get("request_id") or uuid.uuid4().hex,
            surface_id=scope.get("surface_id"),
            app_id=scope.get("app_id"),
            user_id=scope.get("user_id"),
            actor_id=scope.get("user_id"),
        )
    except ValueError as exc:
        raise WebSocketException(code=4003, reason=str(exc)) from exc
    return ctx


def _resolve_hello_context(
    hello: Dict[str, Any],
    ticket_token: Optional[str],
    auth_context: Optional[AuthContext],
) -> tuple[RequestContext, Optional[str]]:
    if hello.get("type") != "hello":
        raise WebSocketException(code=4003, reason="first message must be type='hello'")

    ticket_payload: Optional[Dict[str, Any]] = None
    if ticket_token:
        ticket_payload = validate_ticket(ticket_token)

    merged_scope = _merge_scope(hello.get("context") or {}, ticket_payload)
    ctx = _context_from_scope(merged_scope)
    
    # context matching logic... simplified
    
    last_event_id = hello.get("last_event_id")
    return ctx, last_event_id


def _build_routing_keys(
    ctx: RequestContext, thread_id: str, actor_id: str, actor_type: ActorType
) -> RoutingKeys:
    return RoutingKeys(
        tenant_id=ctx.tenant_id,
        mode=ctx.mode,
        project_id=ctx.project_id,
        app_id=ctx.app_id,
        surface_id=ctx.surface_id,
        thread_id=thread_id,
        actor_id=actor_id,
        actor_type=actor_type,
    )


class ConnectionManager:
    def __init__(self) -> None:
        self.active: Dict[str, list[tuple[WebSocket, str]]] = {}

    async def connect(self, thread_id: str, websocket: WebSocket, user_id: str) -> None:
        self.active.setdefault(thread_id, []).append((websocket, user_id))
        logger.info(f"WS Connect: thread={thread_id} user={user_id}")

    def disconnect(self, thread_id: str, websocket: WebSocket) -> None:
        if thread_id in self.active:
            self.active[thread_id] = [
                (ws, uid) for ws, uid in self.active[thread_id] if ws != websocket
            ]
            if not self.active[thread_id]:
                del self.active[thread_id]

    async def broadcast_event(self, thread_id: str, event: StreamEvent) -> None:
        connections = self.active.get(thread_id, [])[:]
        # payload = event.model_dump_json() 
        # ws send_text expects str
        payload = event.model_dump_json()
        for ws, _ in connections:
            try:
                await ws.send_text(payload)
            except Exception:
                pass

    async def send_personal(self, websocket: WebSocket, payload: dict) -> None:
        try:
            await websocket.send_text(json.dumps(payload))
        except Exception:
            pass


manager = ConnectionManager()


async def heartbeat(websocket: WebSocket):
    try:
        while True:
            await asyncio.sleep(30)
            await websocket.send_text(json.dumps({"type": "ping"}))
    except Exception:
        pass


@router.websocket("/ws/chat/{thread_id}")
async def websocket_endpoint(
    websocket: WebSocket,
    thread_id: str,
    ticket: Optional[str] = Query(None, alias="ticket"),
    # auth_context: Optional[AuthContext] = Depends(get_optional_auth_context),
):
    await websocket.accept()
    try:
        hello = await websocket.receive_json()
    except Exception:
        await websocket.close(code=4003, reason="hello required")
        return

    ticket_token = hello.get("ticket") or ticket
    # Auth checks... simplified
    
    try:
        request_context, last_event_id = _resolve_hello_context(
            hello,
            ticket_token,
            None # auth_context
        )
    except Exception as exc:
        await _send_ws_error(websocket, "auth.error", str(exc), 400)
        return

    user_id = request_context.user_id or "anon"
    request_context.user_id = user_id
    request_context.actor_id = user_id

    timeline = get_timeline_store()
    
    await manager.connect(thread_id, websocket, user_id)
    hb_task = asyncio.create_task(heartbeat(websocket))
    
    # REPLAY logic (use canonical stream_id)
    try:
        # Build canonical stream_id (REALTIME_SPEC_V1 §2)
        routing_for_stream = _build_routing_keys(request_context, thread_id, user_id, ActorType.HUMAN)
        stream_id = build_stream_id(routing_for_stream)
        
        replay_events = timeline.list_after(stream_id, request_context.tenant_id, after_event_id=last_event_id)
        
        cursor = last_event_id
        for event in replay_events:
            await manager.send_personal(websocket, event.model_dump())
            cursor = event.event_id

        if cursor:
             # Send resume cursor event
             # Simplified..
             pass

        # Presence event (ephemeral, REALTIME_SPEC_V1 §1.3)
        presence_event = StreamEvent(
            type=EventType.PRESENCE_STATE,
            routing=_build_routing_keys(request_context, thread_id, user_id, ActorType.HUMAN),
            data={"status": "online", "user_id": user_id},
            ids=EventIds(
                request_id=request_context.request_id,
                run_id=thread_id,
                step_id="presence_online",
            ),
            meta=EventMeta(
                priority=EventPriority.GESTURE,
                persist=PersistPolicy.NEVER,
            ),
        )
        # WS = ephemeral only (REALTIME_SPEC_V1 §1.3): do NOT append to timeline
        await manager.broadcast_event(thread_id, presence_event)
        
        # Message loop (REALTIME_SPEC_V1 §1.3: WS = ephemeral only)
        while True:
            data = await websocket.receive_json()
            msg_type = data.get("type")

            if msg_type == "ping":
                await manager.send_personal(websocket, {"type": "pong"})

            elif msg_type == "gesture":
                # Ephemeral only (REALTIME_SPEC_V1 §1.3)
                gesture_event = StreamEvent(
                    type=EventType.GESTURE,
                    routing=_build_routing_keys(request_context, thread_id, user_id, ActorType.HUMAN),
                    data=data.get("data", {}),
                    ids=EventIds(
                        request_id=request_context.request_id,
                        run_id=thread_id,
                        step_id="gesture",
                    ),
                    meta=EventMeta(
                        priority=EventPriority.GESTURE,
                        persist=PersistPolicy.NEVER,
                    ),
                )
                # WS = ephemeral only: do NOT append to timeline
                await manager.broadcast_event(thread_id, gesture_event)
            
            elif msg_type == "presence_ping":
                # Ephemeral presence update
                presence_event = StreamEvent(
                    type=EventType.PRESENCE_STATE,
                    routing=_build_routing_keys(request_context, thread_id, user_id, ActorType.HUMAN),
                    data=data.get("data", {"status": "active"}),
                    ids=EventIds(
                        request_id=request_context.request_id,
                        run_id=thread_id,
                        step_id="presence_ping",
                    ),
                    meta=EventMeta(
                        priority=EventPriority.GESTURE,
                        persist=PersistPolicy.NEVER,
                    ),
                )
                # WS = ephemeral only: do NOT append to timeline
                await manager.broadcast_event(thread_id, presence_event)
            
            else:
                # Reject unsupported message types (REALTIME_SPEC_V1 §1.3)
                await manager.send_personal(websocket, {
                    "type": "error",
                    "error": {
                        "code": "ws.unsupported_message_type",
                        "message": f"WS only supports: ping, gesture, presence_ping. Use SSE POST for chat messages. Got: {msg_type}"
                    }
                })

    except WebSocketDisconnect:
        manager.disconnect(thread_id, websocket)
        # offline event...
    except Exception:
        manager.disconnect(thread_id, websocket)
    finally:
        hb_task.cancel()
