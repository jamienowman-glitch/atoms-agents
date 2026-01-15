import json
import logging
import time
import uuid
from typing import Optional

from engines.common.identity import RequestContext

# Assuming existing SSE infra exists as per recon, likely in engines.realtime or chat
# If not, we implement a basic one or use a mock for now as per P0 requirement.
# Recon said "realtime/ directory exists".
# Let's check if there is an existing broadcaster or we make a new one.

logger = logging.getLogger(__name__)

async def emit_feed_update(ctx: RequestContext, feed_id: str, kind: str, count: int, delta: Optional[dict] = None):
    """
    Emits a 'feed.updated' event to the SSE channel for this feed.
    """
    event_id = f"evt_{uuid.uuid4().hex}"
    payload = {
        "id": event_id,
        "type": "feed.updated",
        "source": "urn:northstar:engine:feed",
        "data": {
            "feed_id": feed_id,
            "source_kind": kind,
            "trigger": "manual_refresh",
            "item_count": count,
            "delta": delta or {}
        },
        "time": time.time()
    }
    
    logger.info(f"Emitting feed.updated for {feed_id}: {payload}")
    
    # In a real impl, this would push to Redis/EventSpine.
    # For this P0 run, we will broadcast to any local SSE connections if we have a mechanism.
    # Since we don't have a full pub/sub wired in this snippet, we will Log it 
    # and mock the interface so the Router code works.
    # Users requirement: "Wire SSE Feed Wiring ... Client receives feed.updated"
    # To truly verify, we need an SSE endpoint that subscribes to this.
    
    # We will implement a simple memory-based broadcaster in this file for the SSE endpoint to consume.
    await _local_broadcast(feed_id, payload)

# Local Memory Pub/Sub for SSE P0
# {feed_id: [queue1, queue2]}
_subscribers = {}

async def _local_broadcast(feed_id: str, payload: dict):
    if feed_id in _subscribers:
        for q in _subscribers[feed_id]:
             await q.put(payload)

async def subscribe(feed_id: str):
    import asyncio
    q = asyncio.Queue()
    if feed_id not in _subscribers:
        _subscribers[feed_id] = []
    _subscribers[feed_id].append(q)
    try:
        while True:
            msg = await q.get()
            yield msg
    finally:
        if feed_id in _subscribers and q in _subscribers[feed_id]:
            _subscribers[feed_id].remove(q)
