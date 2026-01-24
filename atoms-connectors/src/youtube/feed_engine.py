from __future__ import annotations

import logging
import asyncio
import os
from typing import List, Optional, Dict, Any
from uuid import uuid4
from datetime import datetime, timedelta

import httpx
from engines.common.identity import RequestContext
from engines.workbench.local_secrets import LocalSecretStore
from engines.connectors.youtube.feed_store import FeedStore, FeedDefinition, FeedItem

logger = logging.getLogger(__name__)

class FeedEngine:
    def __init__(self):
        self.store = FeedStore()
        self.secrets = LocalSecretStore()

    async def create_feed(self, ctx: RequestContext, name: str, channels: List[str], filters: Dict[str, Any] = None) -> FeedDefinition:
        feed_id = f"feed_yt_{uuid4().hex[:8]}"
        feed = FeedDefinition(
            feed_id=feed_id,
            name=name,
            channels=channels,
            tenant_id=ctx.tenant_id,
            project_id=ctx.project_id,
            surface_id=ctx.surface_id,
            filters=filters or {"longform_only": True}
        )
        return self.store.upsert_feed(ctx, feed)

    async def get_feed(self, ctx: RequestContext, feed_id: str) -> Optional[FeedDefinition]:
        return self.store.get_feed(ctx, feed_id)
    
    async def list_feeds(self, ctx: RequestContext) -> List[FeedDefinition]:
        return self.store.list_feeds(ctx)

    async def get_items(self, ctx: RequestContext, feed_id: str, limit: int = 20, cursor: Optional[str] = None) -> List[FeedItem]:
        return self.store.get_items(ctx, feed_id, limit, cursor)

    async def refresh_feed(self, ctx: RequestContext, feed_id: str) -> Dict[str, Any]:
        """
        Fetches latest videos for all channels in the feed, deduplicates, and persists.
        Returns summary of changes.
        """
        feed = await self.get_feed(ctx, feed_id)
        if not feed:
            raise ValueError(f"Feed {feed_id} not found")

        api_key = os.getenv("YOUTUBE_API_KEY") # Public data access
        # If no strict API key, check secrets (sometimes stored there in dev)
        if not api_key:
             api_key = self.secrets.get_secret("youtube_api_key")
        
        if not api_key:
             # Fallback: Use OAuth token if available, though API Key is better for purely public reads to save quota complexity?
             # Actually OAuth token works fine for public reads too.
             oauth_token = self.secrets.get_secret(f"youtube-oauth-token-{ctx.tenant_id}") or self.secrets.get_secret("youtube-oauth-token")
             if not oauth_token:
                 raise ValueError("No YOUTUBE_API_KEY or valid OAuth token found for ingestion.")
             auth_headers = {"Authorization": f"Bearer {oauth_token}"}
             params_base = {}
        else:
             auth_headers = {}
             params_base = {"key": api_key}

        async with httpx.AsyncClient() as client:
            new_items: List[FeedItem] = []
            
            for channel_input in feed.channels:
                channel_id = await self._resolve_channel_id(client, channel_input, auth_headers, params_base)
                if not channel_id:
                    logger.warning(f"Could not resolve channel {channel_input}")
                    continue
                
                # Fetch videos (Activities or Search or Playlist uploads)
                # "uploads" playlist is most efficient (1 unit cost) vs Search (100 units).
                # 1. Get channel "uploads" playlist ID
                uploads_id = await self._get_uploads_playlist_id(client, channel_id, auth_headers, params_base)
                if not uploads_id:
                    continue

                # 2. Get playlist items
                videos = await self._get_playlist_items(client, uploads_id, auth_headers, params_base)
                
                # 3. Filter and Map
                for v in videos:
                    # Apply filters (longform check requires duration, which needs a separate video details call usually, 
                    # but maybe we skip strict duration check for V0 or do a batch lookup)
                    # For V0: Let's do a batch lookup for duration if we have video IDs.
                    
                    item = FeedItem(
                        video_id=v["resourceId"]["videoId"],
                        feed_id=feed_id,
                        title=v["title"],
                        description=v["description"],
                        published_at=v["publishedAt"],
                        channel_id=channel_id,
                        channel_title=v["channelTitle"],
                        cover_image_url=v["thumbnails"].get("high", {}).get("url") or v["thumbnails"].get("default", {}).get("url"),
                        watch_url=f"https://www.youtube.com/watch?v={v['resourceId']['videoId']}",
                        duration_seconds=0 # Placeholder until detail fetch
                    )
                    new_items.append(item)
            
            # Enrich with duration (batch)
            if new_items:
                video_ids = [item.video_id for item in new_items]
                durations = await self._get_video_durations(client, video_ids, auth_headers, params_base)
                filtered_items = []
                for item in new_items:
                    dur = durations.get(item.video_id, 0)
                    item.duration_seconds = dur
                    if feed.filters.get("longform_only", True):
                        if dur >= 60:
                            filtered_items.append(item)
                    else:
                        filtered_items.append(item)
                
                # Persist
                self.store.upsert_items(ctx, filtered_items)
                
                # TODO: Emit real SSE event here
                # from engines.event_spine.service import EventSpineService
                # await EventSpineService(ctx).publish("youtube_feed.updated", ...)
                
                return {
                    "status": "success",
                    "ingested_count": len(filtered_items),
                    "feed_id": feed_id
                }
            
            return {"status": "success", "ingested_count": 0}

    async def _resolve_channel_id(self, client, input_str: str, headers, params) -> Optional[str]:
        # Simple heuristic: if it starts with UC, assume ID.
        if input_str.startswith("UC") and len(input_str) == 24:
             return input_str
        
        # Handle handles (@name) or search
        # https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q={input_str}
        p = params.copy()
        p.update({"part": "snippet", "type": "channel", "q": input_str, "maxResults": 1})
        try:
            r = await client.get("https://www.googleapis.com/youtube/v3/search", params=p, headers=headers)
            r.raise_for_status()
            data = r.json()
            if "items" in data and len(data["items"]) > 0:
                return data["items"][0]["snippet"]["channelId"]
        except Exception as e:
            logger.error(f"Error resolving channel {input_str}: {e}")
        return None

    async def _get_uploads_playlist_id(self, client, channel_id, headers, params) -> Optional[str]:
        p = params.copy()
        p.update({"part": "contentDetails", "id": channel_id})
        try:
            r = await client.get("https://www.googleapis.com/youtube/v3/channels", params=p, headers=headers)
            r.raise_for_status()
            data = r.json()
            if "items" in data and len(data["items"]) > 0:
                return data["items"][0]["contentDetails"]["relatedPlaylists"]["uploads"]
        except Exception as e:
            logger.error(f"Error getting uploads for {channel_id}: {e}")
        return None

    async def _get_playlist_items(self, client, playlist_id, headers, params) -> List[Dict]:
        p = params.copy()
        p.update({"part": "snippet", "playlistId": playlist_id, "maxResults": 10}) # Limit 10 for v0
        try:
            r = await client.get("https://www.googleapis.com/youtube/v3/playlistItems", params=p, headers=headers)
            r.raise_for_status()
            data = r.json()
            items = []
            if "items" in data:
                 for i in data["items"]:
                     items.append(i["snippet"])
            return items
        except Exception as e:
             logger.error(f"Error getting playlist items {playlist_id}: {e}")
             return []

    async def _get_video_durations(self, client, video_ids, headers, params) -> Dict[str, int]:
        # video_ids likely need batching if > 50. assuming < 50 for v0.
        p = params.copy()
        p.update({"part": "contentDetails", "id": ",".join(video_ids)})
        res = {}
        try:
             r = await client.get("https://www.googleapis.com/youtube/v3/videos", params=p, headers=headers)
             r.raise_for_status()
             data = r.json()
             if "items" in data:
                 for i in data["items"]:
                     iso_duration = i["contentDetails"]["duration"]
                     res[i["id"]] = self._parse_duration(iso_duration)
        except Exception as e:
            logger.error(f"Error getting durations: {e}")
        return res

    def _parse_duration(self, iso_duration: str) -> int:
        # PT1H2M10S -> seconds
        # Very naive parser or use isodate
        import re
        # PT#H#M#S
        match = re.match(r'PT((?P<hours>\d+)H)?((?P<minutes>\d+)M)?((?P<seconds>\d+)S)?', iso_duration)
        if not match:
             return 0
        h = int(match.group('hours') or 0)
        m = int(match.group('minutes') or 0)
        s = int(match.group('seconds') or 0)
        return h * 3600 + m * 60 + s
