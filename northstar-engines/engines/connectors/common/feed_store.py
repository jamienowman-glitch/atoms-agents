from __future__ import annotations
import json
import logging
import os
import time
from dataclasses import dataclass, asdict
from typing import Dict, List, Optional, Any, Union
from threading import Lock

from engines.common.identity import RequestContext

logger = logging.getLogger(__name__)

# Reusing definitions from MULTI21_FEED_CONTRACT_v0.md
# but implementing them as Pydantic or Dataclass for durability

@dataclass
class FeedDefinition:
    feed_id: str
    name: str
    feed_type: str # products, collections, mixed
    source_kind: str # youtube, shopify_products, etc.
    source_config: Dict[str, Any] # e.g. shop_domain, channel_id
    created_at: float
    updated_at: float
    # Scope
    tenant_id: str
    project_id: str
    surface_id: str

@dataclass
class FeedItem:
    item_id: str
    feed_id: str
    title: str
    url: Optional[str] = None
    image_url: Optional[str] = None
    price_min: Optional[str] = None
    price_max: Optional[str] = None
    currency: Optional[str] = None
    manual_order: Optional[int] = None
    raw_data: Dict[str, Any] = None
    ingested_at: float = 0.0

class GenericFeedStore:
    """
    A unified store for all feed kinds.
    Persists to JSON files in /tmp/northstar_feeds/{tenant}/{project}/ (Dev Durability)
    This replaces individual connector stores for 'management' but connectors 
    might still have their own ingestion logic.
    """
    _instance = None
    _lock = Lock()

    def __new__(cls, *args, **kwargs):
         if cls._instance is None:
             with cls._lock:
                 if cls._instance is None:
                     cls._instance = super(GenericFeedStore, cls).__new__(cls)
                     cls._instance._mem_feeds = {}
                     cls._instance._mem_items = {}
         return cls._instance

    def _get_storage_path(self, ctx: RequestContext) -> str:
        # Partition by tenant/project
        path = f"/tmp/northstar_feeds/{ctx.tenant_id}/{ctx.project_id}"
        os.makedirs(path, exist_ok=True)
        return path

    def _load_feeds(self, ctx: RequestContext) -> Dict[str, FeedDefinition]:
        # Simple JSON file persistence
        path = os.path.join(self._get_storage_path(ctx), "feeds.json")
        if not os.path.exists(path):
            return {}
        try:
            with open(path, 'r') as f:
                data = json.load(f)
                return {k: FeedDefinition(**v) for k, v in data.items()}
        except Exception as e:
            logger.error(f"Failed to load feeds: {e}")
            return {}

    def _save_feeds(self, ctx: RequestContext, feeds: Dict[str, FeedDefinition]):
        path = os.path.join(self._get_storage_path(ctx), "feeds.json")
        with open(path, 'w') as f:
            json.dump({k: asdict(v) for k, v in feeds.items()}, f, indent=2)

    def _load_items(self, ctx: RequestContext, feed_id: str) -> List[FeedItem]:
        path = os.path.join(self._get_storage_path(ctx), f"items_{feed_id}.json")
        if not os.path.exists(path):
            return []
        try:
            with open(path, 'r') as f:
                data = json.load(f)
                return [FeedItem(**i) for i in data]
        except Exception:
            return []

    def _save_items(self, ctx: RequestContext, feed_id: str, items: List[FeedItem]):
        path = os.path.join(self._get_storage_path(ctx), f"items_{feed_id}.json")
        with open(path, 'w') as f:
            json.dump([asdict(i) for i in items], f, indent=2)

    async def upsert_feed(self, ctx: RequestContext, feed: FeedDefinition):
        feeds = self._load_feeds(ctx)
        feeds[feed.feed_id] = feed
        self._save_feeds(ctx, feeds)

    async def get_feed(self, ctx: RequestContext, feed_id: str) -> Optional[FeedDefinition]:
        feeds = self._load_feeds(ctx)
        return feeds.get(feed_id)

    async def list_feeds(self, ctx: RequestContext, kind: Optional[str] = None) -> List[FeedDefinition]:
        feeds = self._load_feeds(ctx)
        all_feeds = list(feeds.values())
        if kind:
            return [f for f in all_feeds if f.source_kind == kind]
        return all_feeds

    async def upsert_items(self, ctx: RequestContext, feed_id: str, items: List[FeedItem]):
        # Overwrite all items for now (simplistic ingestion)
        # Ideally merge. 
        self._save_items(ctx, feed_id, items)

    async def get_items(self, ctx: RequestContext, feed_id: str, limit: int = 20, cursor: Optional[str] = None) -> List[FeedItem]:
        items = self._load_items(ctx, feed_id)
        # Sort by ingested_at desc
        items.sort(key=lambda x: x.ingested_at, reverse=True)
        
        start = 0
        if cursor:
             try:
                 start = int(cursor)
             except:
                 pass
        
        return items[start : start + limit]

def get_feed_store() -> GenericFeedStore:
    return GenericFeedStore()
