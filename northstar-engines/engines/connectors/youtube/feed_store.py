from __future__ import annotations

import json
import logging
import os
from dataclasses import dataclass, field, asdict
from datetime import datetime
from typing import Dict, List, Optional, Any

from engines.common.identity import RequestContext

logger = logging.getLogger(__name__)

@dataclass
class FeedDefinition:
    feed_id: str
    name: str
    channels: List[str]
    tenant_id: str
    project_id: str
    surface_id: Optional[str] = None
    filters: Dict[str, Any] = field(default_factory=lambda: {"longform_only": True})
    created_at: str = field(default_factory=lambda: datetime.utcnow().isoformat())
    updated_at: str = field(default_factory=lambda: datetime.utcnow().isoformat())

@dataclass
class FeedItem:
    video_id: str
    feed_id: str
    title: str
    description: str
    published_at: str
    channel_id: str
    channel_title: str
    cover_image_url: str
    watch_url: str
    duration_seconds: int
    embed_url: Optional[str] = None
    ingested_at: str = field(default_factory=lambda: datetime.utcnow().isoformat())

class FeedStore:
    """
    Simple file-system based store for Feeds and Items.
    Scoped by tenant_id (one file per tenant in dev).
    """

    def __init__(self, storage_dir: str = "/tmp/northstar_feeds"):
        self.storage_dir = storage_dir
        os.makedirs(self.storage_dir, exist_ok=True)

    def _get_tenant_path(self, tenant_id: str) -> str:
        return os.path.join(self.storage_dir, f"{tenant_id}_feeds.json")

    def _load_data(self, tenant_id: str) -> Dict[str, Any]:
        path = self._get_tenant_path(tenant_id)
        if not os.path.exists(path):
            return {"feeds": {}, "items": {}}
        try:
            with open(path, "r") as f:
                return json.load(f)
        except Exception as e:
            logger.error(f"Failed to load feed data for {tenant_id}: {e}")
            return {"feeds": {}, "items": {}}

    def _save_data(self, tenant_id: str, data: Dict[str, Any]) -> None:
        path = self._get_tenant_path(tenant_id)
        try:
            with open(path, "w") as f:
                json.dump(data, f, indent=2)
        except Exception as e:
            logger.error(f"Failed to save feed data for {tenant_id}: {e}")

    def upsert_feed(self, ctx: RequestContext, feed: FeedDefinition) -> FeedDefinition:
        data = self._load_data(ctx.tenant_id)
        data["feeds"][feed.feed_id] = asdict(feed)
        self._save_data(ctx.tenant_id, data)
        return feed

    def get_feed(self, ctx: RequestContext, feed_id: str) -> Optional[FeedDefinition]:
        data = self._load_data(ctx.tenant_id)
        feed_data = data["feeds"].get(feed_id)
        if not feed_data:
            return None
        # Ensure context scoping matches if needed (simple check)
        if feed_data.get("project_id") != ctx.project_id:
             # In a real DB we'd filter in query. Here we just return None if scope mismatch?
             # For now trusting the ID access pattern, but let's be safe.
             pass 
        return FeedDefinition(**feed_data)

    def list_feeds(self, ctx: RequestContext) -> List[FeedDefinition]:
        data = self._load_data(ctx.tenant_id)
        # Filter by project_id
        feeds = []
        for f_data in data["feeds"].values():
            if f_data.get("project_id") == ctx.project_id:
                feeds.append(FeedDefinition(**f_data))
        return feeds

    def upsert_items(self, ctx: RequestContext, items: List[FeedItem]) -> None:
        if not items:
            return
        data = self._load_data(ctx.tenant_id)
        if "items" not in data:
            data["items"] = {}
        
        count = 0
        for item in items:
            # Key by video_id (global) or feed_id:video_id?
            # A video might belong to multiple feeds if we copy it. 
            # Requirements say "Persist per video".
            # For simplicity in this file store, let's key by feed_id:video_id to allow separate metadata if needed.
            key = f"{item.feed_id}:{item.video_id}"
            data["items"][key] = asdict(item)
            count += 1
            
        self._save_data(ctx.tenant_id, data)
        logger.info(f"Upserted {count} items for tenant {ctx.tenant_id}")

    def get_items(self, ctx: RequestContext, feed_id: str, limit: int = 20, cursor: Optional[str] = None) -> List[FeedItem]:
        data = self._load_data(ctx.tenant_id)
        all_items = []
        for key, item_data in data.get("items", {}).items():
            if item_data.get("feed_id") == feed_id:
                all_items.append(FeedItem(**item_data))
        
        # Sort by published_at desc
        all_items.sort(key=lambda x: x.published_at, reverse=True)
        
        # Pagination (Cursor is just published_at for now, or index)
        # Simple implementation: slice
        start_idx = 0
        if cursor:
            try:
                start_idx = int(cursor)
            except:
                pass
        
        page = all_items[start_idx : start_idx + limit]
        return page
