from __future__ import annotations

import logging
import asyncio
from typing import List, Optional, Dict, Any

from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel
from sse_starlette.sse import EventSourceResponse

from engines.common.identity import RequestContext, get_request_context
from engines.connectors.shopify.feed_engine import FeedEngine

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/feeds/shopify", tags=["shopify_feeds"])

# --- Schemas ---

class CreateFeedRequest(BaseModel):
    name: str
    shop_domain: str
    feed_type: str = "products"
    filters: Optional[Dict[str, Any]] = None

class FeedResponse(BaseModel):
    feed_id: str
    name: str
    shop_domain: str
    feed_type: str

class RefreshResponse(BaseModel):
    status: str
    ingested_count: int
    feed_id: str

# --- Endpoints ---

@router.post("", response_model=FeedResponse)
async def create_feed(
    req: CreateFeedRequest,
    ctx: RequestContext = Depends(get_request_context)
):
    engine = FeedEngine()
    feed = await engine.create_feed(ctx, req.name, req.shop_domain, req.feed_type, req.filters)
    return {
        "feed_id": feed.feed_id,
        "name": feed.name,
        "shop_domain": feed.shop_domain,
        "feed_type": feed.feed_type
    }

@router.get("", response_model=List[FeedResponse])
async def list_feeds(
    ctx: RequestContext = Depends(get_request_context)
):
    engine = FeedEngine()
    feeds = await engine.list_feeds(ctx)
    return [
        {
            "feed_id": f.feed_id,
            "name": f.name,
            "shop_domain": f.shop_domain,
            "feed_type": f.feed_type
        }
        for f in feeds
    ]

@router.get("/{feed_id}", response_model=FeedResponse)
async def get_feed(
    feed_id: str,
    ctx: RequestContext = Depends(get_request_context)
):
    engine = FeedEngine()
    feed = await engine.get_feed(ctx, feed_id)
    if not feed:
        raise HTTPException(status_code=404, detail="Feed not found")
    return {
        "feed_id": feed.feed_id,
        "name": feed.name,
        "shop_domain": feed.shop_domain,
        "feed_type": feed.feed_type
    }

@router.post("/{feed_id}:refresh", response_model=RefreshResponse)
async def refresh_feed(
    feed_id: str,
    ctx: RequestContext = Depends(get_request_context)
):
    engine = FeedEngine()
    try:
        result = await engine.refresh_feed(ctx, feed_id)
        return result
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logger.exception("Refresh failed")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{feed_id}/items")
async def get_feed_items(
    feed_id: str,
    limit: int = 20,
    cursor: Optional[str] = None,
    ctx: RequestContext = Depends(get_request_context)
):
    engine = FeedEngine()
    items = await engine.get_items(ctx, feed_id, limit, cursor)
    return items

# --- SSE / WS ---

@router.get("/sse/feeds/shopify/{feed_id}")
async def sse_feed_updates(
    feed_id: str,
    request: Request,
    ctx: RequestContext = Depends(get_request_context)
):
    async def event_generator():
        yield {
            "event": "connected",
            "data": "connected to feed stream"
        }
        
        while True:
            if await request.is_disconnected():
                break
            await asyncio.sleep(5)
            yield {
                "event": "heartbeat",
                "data": "ping"
            }

    return EventSourceResponse(event_generator())

from fastapi import WebSocket

@router.websocket("/ws/feeds/shopify/{feed_id}")
async def ws_feed_updates(websocket: WebSocket, feed_id: str):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            await websocket.send_text(f"Message text was: {data}")
    except Exception:
        pass
