import logging
import uuid
from typing import Optional

from engines.common.identity import RequestContext
from engines.realtime.timeline import get_timeline_service
from engines.realtime.contracts import (
    StreamEvent,
    RoutingKeys,
    EventIds,
    EventMeta,
    ActorType,
    PersistPolicy
)

logger = logging.getLogger(__name__)

async def emit_feed_update(ctx: RequestContext, feed_id: str, kind: str, count: int, delta: Optional[dict] = None):
    """
    Emits a 'system.feed_update' event to the unified Timeline.
    """
    event = StreamEvent(
        type="system.feed_update",
        event_id=f"evt_{uuid.uuid4().hex}",
        ids=EventIds(
            request_id=ctx.request_id,
            run_id=feed_id,
            step_id=uuid.uuid4().hex
        ),
        routing=RoutingKeys(
            tenant_id=ctx.tenant_id,
            env=ctx.env, # type: ignore
            mode=ctx.mode,
            project_id=ctx.project_id,
            actor_id=ctx.actor_id,
            actor_type=ActorType.SYSTEM
        ),
        data={
            "feed_id": feed_id,
            "source_kind": kind,
            "trigger": "manual_refresh",
            "item_count": count,
            "delta": delta or {}
        },
        meta=EventMeta(
            priority="info",
            persist=PersistPolicy.ALWAYS
        )
    )
    
    logger.info(f"Emitting feed.updated via TimelineService: {event.event_id}")
    await get_timeline_service().append_event(event, ctx)
