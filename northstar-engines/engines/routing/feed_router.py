from typing import List, Optional, Any, Dict
from fastapi import APIRouter, Depends, HTTPException, Query, Path
from engines.common.identity import RequestContext, get_request_context
from engines.connectors.common.feed_store import get_feed_store, FeedDefinition, FeedItem

# Ingest Engines (Should be injected or registry-based)
# For P0, we hard-wire provided connectors.
# If generic manual feeds are needed, they use GenericFeedStore directly without ingestion logic.
from engines.connectors.youtube.feed_engine import FeedEngine as YouTubeEngine
from engines.connectors.shopify.feed_engine import FeedEngine as ShopifyEngine

router = APIRouter()

# Registry of Engines
ENGINES = {
    "youtube": YouTubeEngine,
    "shopify_products": ShopifyEngine,
    # "manual": Only uses store, no specialized engine instance
}

def get_engine(kind: str):
    return ENGINES.get(kind)

@router.get("/summary", response_model=Dict[str, Any])
async def get_feeds_summary(ctx: RequestContext = Depends(get_request_context)):
    """
    Used by Feed Picker UI.
    Returns grouped list of feeds.
    """
    store = get_feed_store()
    all_feeds = await store.list_feeds(ctx)
    
    # Sort by kind
    grouped = {}
    for f in all_feeds:
        if f.source_kind not in grouped:
            grouped[f.source_kind] = []
        grouped[f.source_kind].append(f)
        
    return {
        "sources": list(grouped.keys()),
        "feeds": all_feeds # Flattened list also useful
    }

@router.get("/{kind}")
async def list_feeds(kind: str, ctx: RequestContext = Depends(get_request_context)):
    # If specific engine, delegate? Or just use common store?
    # Common store is source of truth for definitions.
    store = get_feed_store()
    return await store.list_feeds(ctx, kind)

@router.post("/{kind}")
async def create_feed(kind: str, payload: Dict[str, Any], ctx: RequestContext = Depends(get_request_context)):
    engine_cls = get_engine(kind)
    if not engine_cls:
        # TODO: Handle manual feeds
        raise HTTPException(status_code=400, detail=f"Unsupported feed kind: {kind}")
        
    engine = engine_cls()
    # Adapters needed if engines have different signatures.
    # We assume standard signature per our contract implementation pass.
    # YouTube: create_feed(ctx, name, channel_urls, filters)
    # Shopify: create_feed(ctx, name, shop_domain, feed_type, filters)
    
    try:
        if kind == "youtube":
            return await engine.create_feed(ctx, payload["name"], payload.get("channel_urls", []), payload.get("filters"))
        elif kind.startswith("shopify"):
             # feed_type mapping
             ftype = "products" if "products" in kind else "collections"
             return await engine.create_feed(ctx, payload["name"], payload["shop_domain"], ftype, payload.get("filters"))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{kind}/{feed_id}")
async def get_feed(kind: str, feed_id: str, ctx: RequestContext = Depends(get_request_context)):
     store = get_feed_store()
     feed = await store.get_feed(ctx, feed_id)
     if not feed:
         raise HTTPException(status_code=404, detail="Feed not found")
     return feed

@router.post("/{kind}/{feed_id}:refresh")
async def refresh_feed(kind: str, feed_id: str, ctx: RequestContext = Depends(get_request_context)):
    engine_cls = get_engine(kind)
    if not engine_cls:
         raise HTTPException(status_code=400, detail="No engine for this kind")
         
    engine = engine_cls()
    result = await engine.refresh_feed(ctx, feed_id)
    
    # [NEW] Emit SSE Event here
    from engines.realtime.broadcaster import emit_feed_update
    await emit_feed_update(ctx, feed_id, kind, result.get("ingested_count", 0))
    
    return result

@router.get("/{kind}/{feed_id}/items")
async def get_items(kind: str, feed_id: str, limit: int = 20, cursor: Optional[str] = None, ctx: RequestContext = Depends(get_request_context)):
    store = get_feed_store()
    return await store.get_items(ctx, feed_id, limit, cursor)
