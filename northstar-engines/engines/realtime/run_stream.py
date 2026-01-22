"""Run-level SSE helpers for timeline-backed events."""
from __future__ import annotations

import asyncio
import logging
import uuid
from collections import defaultdict
from typing import AsyncGenerator, Any, Dict, Optional, Set

from engines.common.identity import RequestContext
from engines.realtime.contracts import (
    ActorType,
    EventIds,
    EventMeta,
    EventPriority,
    PersistPolicy,
    RoutingKeys,
    StreamEvent,
)
from engines.realtime.timeline import get_timeline_service, get_timeline_store

logger = logging.getLogger(__name__)


class _RunStreamBus:
    def __init__(self) -> None:
        self._subscribers: Dict[str, Set[asyncio.Queue[StreamEvent]]] = defaultdict(set)

    def publish(self, run_id: str, event: StreamEvent) -> None:
        for queue in list(self._subscribers.get(run_id, set())):
            try:
                queue.put_nowait(event)
            except asyncio.QueueFull:
                pass

    def subscribe(self, run_id: str) -> asyncio.Queue[StreamEvent]:
        queue: asyncio.Queue[StreamEvent] = asyncio.Queue()
        self._subscribers.setdefault(run_id, set()).add(queue)
        return queue

    def unsubscribe(self, run_id: str, queue: asyncio.Queue[StreamEvent]) -> None:
        subscribers = self._subscribers.get(run_id)
        if not subscribers:
            return
        subscribers.discard(queue)
        if not subscribers:
            self._subscribers.pop(run_id, None)


_run_stream_bus = _RunStreamBus()


async def publish_run_event(
    context: RequestContext,
    run_id: str,
    event_type: str,
    data: Dict[str, Any],
    *,
    node_id: Optional[str] = None,
    edge_id: Optional[str] = None,
) -> StreamEvent:
    """Persist and broadcast a run-level event."""
    if not run_id:
        raise ValueError("run_id is required for run stream events")

    actor_id = context.actor_id or context.user_id or "system"
    if context.actor_id:
        actor_type = ActorType.AGENT if context.actor_id.startswith("agent") else ActorType.HUMAN
    elif context.user_id:
        actor_type = ActorType.HUMAN
    else:
        actor_type = ActorType.SYSTEM

    payload: Dict[str, Any] = dict(data)
    resolved_node_id = node_id or payload.get("source_node_id") or payload.get("node_id")
    agent_id = context.actor_id or context.user_id or "system"
    provenance: Dict[str, Optional[str]] = {
        "agent_id": agent_id,
        "node_id": resolved_node_id,
        "run_id": run_id,
    }
    if edge_id:
        provenance["edge_id"] = edge_id
    if not resolved_node_id:
        logger.warning("Run event %s missing node_id (run=%s)", event_type, run_id)
    payload["provenance"] = provenance

    event = StreamEvent(
        type=event_type,
        event_id=uuid.uuid4().hex,
        ids=EventIds(
            request_id=context.request_id,
            run_id=run_id,
            step_id=event_type,
        ),
        routing=RoutingKeys(
            tenant_id=context.tenant_id,
            env=context.env,
            mode=context.mode,
            project_id=context.project_id,
            app_id=context.app_id,
            surface_id=context.surface_id,
            thread_id=run_id,
            actor_id=actor_id,
            actor_type=actor_type,
        ),
        trace_id=context.request_id,
        data=payload,
        meta=EventMeta(
            priority=EventPriority.INFO,
            persist=PersistPolicy.ALWAYS,
            last_event_id="",
        ),
    )
    event.meta.last_event_id = event.event_id

    timeline_store = get_timeline_store()
    try:
        timeline_store.append(run_id, event, context)
    except Exception as exc:
        logger.warning("Failed to persist run event to timeline store: %s", exc)
    try:
        await get_timeline_service().append_event(event, context)
    except Exception as exc:
        logger.warning("Failed to append run event to timeline service: %s", exc)

    _run_stream_bus.publish(run_id, event)
    return event


def format_sse_event(event: StreamEvent) -> str:
    payload = event.model_dump_json()
    return f"id: {event.event_id}\nevent: {event.type}\ndata: {payload}\n\n"


async def stream_run_events(
    run_id: str,
    context: RequestContext,
    last_event_id: Optional[str] = None,
) -> AsyncGenerator[StreamEvent, None]:
    queue = _run_stream_bus.subscribe(run_id)
    seen_ids: Set[str] = set()
    try:
        store = get_timeline_store()
        history = store.list_after(run_id, after_event_id=last_event_id)
        for event in history:
            seen_ids.add(event.event_id)
            yield event
        while True:
            event = await queue.get()
            if event.event_id in seen_ids:
                continue
            seen_ids.add(event.event_id)
            yield event
    finally:
        _run_stream_bus.unsubscribe(run_id, queue)
