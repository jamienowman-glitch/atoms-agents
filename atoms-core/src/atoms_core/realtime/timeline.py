"""Durable timeline store for realtime stream events (Ported to atoms-core)."""
from __future__ import annotations

import asyncio
import logging
import os
from typing import Dict, List, Optional, Protocol, Set, Union

from src.identity.models import RequestContext
from src.realtime.contracts import StreamEvent

logger = logging.getLogger(__name__)


# --- Canonical Stream ID (REALTIME_SPEC_V1 §1.6) ---

def build_stream_id(routing) -> str:
    """
    Build deterministic stream_id from routing keys.
    Rule: {tenant_id}:{project_id}:{thread_id or canvas_id or run_id}
    """
    tenant = routing.tenant_id
    project = routing.project_id
    
    # Priority: thread_id > canvas_id > run_id (from EventIds if available)
    stream_suffix = routing.thread_id or routing.canvas_id
    if not stream_suffix:
        # Fallback to run_id if routing doesn't have it directly
        stream_suffix = "default"
    
    return f"{tenant}:{project}:{stream_suffix}"


def build_partition_key(tenant_id: str, stream_id: str) -> str:
    """
    Build partitioned storage key.
    Format: {tenant_id}:{stream_id}
    """
    return f"{tenant_id}:{stream_id}"


class TimelineStore(Protocol):
    def append(self, stream_id: str, event: StreamEvent, context: RequestContext) -> None: ...
    def list_after(self, stream_id: str, tenant_id: str, after_event_id: Optional[str] = None) -> List[StreamEvent]: ...


class InMemoryTimelineStore:
    def __init__(self, storage: Optional[Dict[str, List[StreamEvent]]] = None) -> None:
        self._storage: Dict[str, List[StreamEvent]] = storage if storage is not None else {}

    def _validate_scope(self, event: StreamEvent, context: RequestContext) -> None:
        # Tenant isolation (REALTIME_SPEC_V1 §1.6)
        routing = event.routing
        if routing.tenant_id != context.tenant_id:
            raise RuntimeError(f"Timeline routing tenant mismatch: {routing.tenant_id} != {context.tenant_id}")
        if routing.project_id != context.project_id:
            raise RuntimeError(f"Timeline routing project mismatch: {routing.project_id} != {context.project_id}")

    def append(self, stream_id: str, event: StreamEvent, context: RequestContext) -> None:
        if context is None:
            raise RuntimeError("RequestContext is required for timeline append")
        self._validate_scope(event, context)
        
        # Partition by tenant (REALTIME_SPEC_V1 §1.6)
        partition_key = build_partition_key(context.tenant_id, stream_id)
        bucket = self._storage.setdefault(partition_key, [])
        bucket.append(event)

    def list_after(self, stream_id: str, tenant_id: str, after_event_id: Optional[str] = None) -> List[StreamEvent]:
        # Partition by tenant (prevent cross-tenant reads)
        partition_key = build_partition_key(tenant_id, stream_id)
        events = list(self._storage.get(partition_key, []))
        if not after_event_id:
            return events
        for idx, ev in enumerate(events):
            if ev.event_id == after_event_id:
                return events[idx + 1 :]
        return []


class CosmosTimelineStore:
    """
    Stub for CosmosDB backend (Production).
    """
    def __init__(self) -> None:
        # Initialize Cosmos client here in future
        pass

    def append(self, stream_id: str, event: StreamEvent, context: RequestContext) -> None:
        # TODO: Implement atomic append to Cosmos container
        pass

    def list_after(self, stream_id: str, after_event_id: Optional[str] = None) -> List[StreamEvent]:
        # TODO: Implement query
        return []


def _default_timeline_store() -> TimelineStore:
    # Use env var to switch, default to memory for now
    backend = os.getenv("TIMELINE_BACKEND", "memory").lower()
    if backend == "cosmos":
        return CosmosTimelineStore()
    return InMemoryTimelineStore()


_timeline_store: Optional[TimelineStore] = None


def get_timeline_store() -> TimelineStore:
    global _timeline_store
    if _timeline_store is None:
        _timeline_store = _default_timeline_store()
    return _timeline_store


def set_timeline_store(store: TimelineStore) -> None:
    global _timeline_store
    _timeline_store = store

class TimelineService:
    def __init__(self, store: TimelineStore) -> None:
        self.store = store
        self._subscribers: Set[asyncio.Queue] = set()

    async def append_event(self, event: Union[StreamEvent, dict], context: Optional[RequestContext] = None) -> None:
        """
        Append an event to the unified timeline and broadcast it.
        """
        if isinstance(event, dict):
            try:
                event = StreamEvent(**event)
            except Exception as e:
                raise ValueError(f"Event must be a StreamEvent or compatible dict: {e}")

        if context is None:
            raise RuntimeError("RequestContext is required for timeline append")

        # 1. Persist to unified timeline
        # using "unified_timeline" or stream specific key. 
        # For atoms-core, we might separate by tenant or use event.routing.thread_id
        # adhering to legacy logic:
        stream_key = "unified_timeline"
        if event.routing.thread_id:
             stream_key = event.routing.thread_id
        
        self.store.append(stream_key, event, context)

        # 2. Broadcast to live queues
        for q in list(self._subscribers):
            try:
                q.put_nowait(event)
            except Exception:
                pass

    async def stream_events(self, cursor: Optional[str] = None):
        """
        Stream events from the timeline.
        """
        # Register queue first
        q = asyncio.Queue()
        self._subscribers.add(q)
        seen_ids = set()

        try:
            # TODO: Improve this to support tenant filtering on stream
            # Currently streams EVERYTHING (dev mode assumption).
            
            # Yield live only for now or implement better backfill
            while True:
                ev = await q.get()
                if ev.event_id not in seen_ids:
                    seen_ids.add(ev.event_id)
                    yield ev
        finally:
            self._subscribers.discard(q)


_timeline_service: Optional[TimelineService] = None


def get_timeline_service() -> TimelineService:
    global _timeline_service
    if _timeline_service is None:
        _timeline_service = TimelineService(get_timeline_store())
    return _timeline_service
