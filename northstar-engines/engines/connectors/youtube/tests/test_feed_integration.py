import asyncio
import os
import shutil
import pytest
from unittest.mock import MagicMock, patch

from engines.common.identity import RequestContext
from engines.connectors.youtube.feed_engine import FeedEngine, FeedDefinition
from engines.connectors.youtube import impl

# Helper to create context
def create_test_context():
    return RequestContext(
        tenant_id="t_test_tenant",
        mode="lab",
        project_id="p_test_project",
        request_id="test_req"
    )

@pytest.fixture
def clean_store():
    store_dir = "/tmp/northstar_feeds"
    if os.path.exists(store_dir):
        shutil.rmtree(store_dir)
    yield
    # Cleanup after
    if os.path.exists(store_dir):
        shutil.rmtree(store_dir)

@pytest.fixture
def mock_httpx():
    with patch("httpx.AsyncClient") as mock:
        yield mock

@pytest.fixture(autouse=True)
def mock_secrets():
    with patch("engines.connectors.youtube.feed_engine.LocalSecretStore") as mock_cls:
        mock_instance = mock_cls.return_value
        mock_instance.get_secret.return_value = "mock_secret"
        yield mock_instance

# Synchronous wrappers for async tests (avoiding pytest-asyncio dependency)

# Synchronous wrappers for async tests (avoiding pytest-asyncio dependency)

def run_async(coro):
    return asyncio.run(coro)

def test_feed_crud(clean_store):
    async def _test():
        ctx = create_test_context()
        engine = FeedEngine()
        
        # 1. Create
        feed = await engine.create_feed(ctx, "Test Feed", ["UC_test_channel_12345678"])
        assert feed.name == "Test Feed"
        assert feed.feed_id.startswith("feed_yt_")
        
        # 2. List
        feeds = await engine.list_feeds(ctx)
        assert len(feeds) == 1
        assert feeds[0].feed_id == feed.feed_id
        
        # 3. Get
        fetched = await engine.get_feed(ctx, feed.feed_id)
        assert fetched is not None
        assert fetched.name == "Test Feed"
    
    run_async(_test())

def test_ingestion_mocked(clean_store, mock_httpx):
    async def _test():
        ctx = create_test_context()
        engine = FeedEngine()
        feed = await engine.create_feed(ctx, "Ingestion Feed", ["UC_test_channel_12345678"])
        
        # Mock HTTP responses
        mock_client = MagicMock()
        mock_httpx.return_value.__aenter__.return_value = mock_client
        
        # 1. Resolve Channel -> Same ID
        # 2. Get Uploads Playlist -> "PL_uploads"
        # 3. Get Playlist Items -> 1 video
        # 4. Get Duration -> 120s
        
        async def side_effect(url, params=None, headers=None):
            mock_resp = MagicMock()
            mock_resp.raise_for_status = lambda: None
            
            if "channels" in url:
                mock_resp.json.return_value = {
                    "items": [{"contentDetails": {"relatedPlaylists": {"uploads": "PL_uploads"}}}]
                }
            elif "playlistItems" in url:
                mock_resp.json.return_value = {
                    "items": [{
                        "snippet": {
                            "resourceId": {"videoId": "vid_123"},
                            "title": "Test Video",
                            "description": "Desc",
                            "publishedAt": "2025-01-01T00:00:00Z",
                            "channelTitle": "Test Channel",
                            "thumbnails": {"high": {"url": "http://img"}}
                        }
                    }]
                }
            elif "videos" in url:
                 mock_resp.json.return_value = {
                    "items": [{
                        "id": "vid_123",
                        "contentDetails": {"duration": "PT2M"} # 120s
                    }]
                 }
            
            return mock_resp

        mock_client.get.side_effect = side_effect
        
        # Test Refresh
        result = await engine.refresh_feed(ctx, feed.feed_id)
        
        assert result["status"] == "success"
        assert result["ingested_count"] == 1
        
        # Verify Items Persisted
        items = await engine.get_items(ctx, feed.feed_id)
        assert len(items) == 1
        assert items[0].video_id == "vid_123"
        assert items[0].duration_seconds == 120
        
    run_async(_test())

def test_mcp_wiring(clean_store):
    async def _test():
        ctx = create_test_context()
        
        # 1. List (via MCP impl)
        from engines.connectors.youtube.impl import ListYouTubeFeedsInput, list_feeds
        feeds = await list_feeds(ctx, ListYouTubeFeedsInput())
        assert len(feeds) == 0 # Clean store
        
        # 2. Create via Engine directly (MCP doesn't have create? Wait, plan kept create to Engine native API, MCP is read/refresh)
        # Correct. Spec says `youtube.list_feeds`, `refresh`, `get_items`. 
        # Create is done via `POST /feeds/youtube` (Engine API) usually called by UI or higher level agent if tool existed. 
        # But for this test we seed via engine.
        engine = FeedEngine()
        feed = await engine.create_feed(ctx, "MCP Feed", ["UC_mcp_123456789012345678"])
        
        # 3. List again
        feeds = await list_feeds(ctx, ListYouTubeFeedsInput())
        assert len(feeds) == 1
        assert feeds[0]["name"] == "MCP Feed"
        
    run_async(_test())
