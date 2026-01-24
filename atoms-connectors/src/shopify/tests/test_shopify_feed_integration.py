import asyncio
import os
import shutil
import pytest
from unittest.mock import MagicMock, patch, AsyncMock

from engines.common.identity import RequestContext
from engines.connectors.shopify.feed_engine import FeedEngine, FeedDefinition

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
    store_dir = "/tmp/northstar_shopify_feeds"
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
    # Patching where it is used. It's used in FeedEngine.
    with patch("engines.connectors.shopify.feed_engine.LocalSecretStore") as mock_cls:
        mock_instance = mock_cls.return_value
        mock_instance.get_secret.return_value = "mock_token"
        yield mock_instance

# Synchronous wrapper
def run_async(coro):
    return asyncio.run(coro)

def test_feed_crud(clean_store):
    async def _test():
        ctx = create_test_context()
        engine = FeedEngine()
        
        # 1. Create
        feed = await engine.create_feed(ctx, "Shopify Feed", "test-shop.myshopify.com")
        assert feed.name == "Shopify Feed"
        assert feed.feed_id.startswith("feed_sh_")
        
        # 2. List
        feeds = await engine.list_feeds(ctx)
        assert len(feeds) == 1
        assert feeds[0].feed_id == feed.feed_id
        
        # 3. Get
        fetched = await engine.get_feed(ctx, feed.feed_id)
        assert fetched is not None
        assert fetched.name == "Shopify Feed"
    
    run_async(_test())

def test_ingestion_products_mocked(clean_store, mock_httpx):
    async def _test():
        ctx = create_test_context()
        engine = FeedEngine()
        feed = await engine.create_feed(ctx, "Product Feed", "test-shop.myshopify.com", feed_type="products")
        
        # Mock HTTP response
        mock_client = MagicMock()
        mock_httpx.return_value.__aenter__.return_value = mock_client
        
        mock_resp = MagicMock()
        mock_resp.raise_for_status = lambda: None
        mock_resp.json.return_value = {
            "data": {
                "products": {
                    "edges": [
                        {
                            "node": {
                                "id": "gid://shopify/Product/123",
                                "title": "Test Product",
                                "handle": "test-product",
                                "onlineStoreUrl": "https://test.com/p",
                                "images": {"edges": [{"node": {"url": "http://img"}}]},
                                "priceRange": {
                                    "minVariantPrice": {"amount": "10.00", "currencyCode": "USD"},
                                    "maxVariantPrice": {"amount": "20.00", "currencyCode": "USD"}
                                },
                                "variants": {"edges": [{"node": {"id": "v1", "title": "Default", "price": {"amount":"10.00"}, "availableForSale": True}}]}
                            }
                        }
                    ]
                }
            }
        }
        # post needs to be awaitable
        mock_client.post = AsyncMock(return_value=mock_resp)
        
        # Test Refresh
        result = await engine.refresh_feed(ctx, feed.feed_id)
        
        assert result["status"] == "success"
        assert result["ingested_count"] == 1
        
        # Verify Items
        items = await engine.get_items(ctx, feed.feed_id)
        assert len(items) == 1
        assert items[0].title == "Test Product"
        assert items[0].price_min == "10.00"

    run_async(_test())

def test_mcp_wiring(clean_store):
    async def _test():
        ctx = create_test_context()
        
        # 1. List (via MCP impl)
        # Note: We need to import from the file where we defined the tools
        from engines.connectors.shopify.impl import ListShopifyFeedsInput, list_feeds
        
        # Create a feed first via engine
        engine = FeedEngine()
        await engine.create_feed(ctx, "MCP Shop Feed", "mcp.myshopify.com")
        
        # List via MCP handler
        feeds = await list_feeds(ctx, ListShopifyFeedsInput())
        assert len(feeds) == 1
        assert feeds[0]["name"] == "MCP Shop Feed"
        
    run_async(_test())
