# Shopify Feed MCP Surface

## Tools

### `shopify.list_feeds`
List configured Shopify feeds.
- **Output**: List of feed definitions.

### `shopify.refresh_feed`
Trigger refresh.
- **Input**: `feed_id`
- **Output**: Status and ingested count.

### `shopify.get_items`
Get items from a feed.
- **Input**: `feed_id`, `limit`, `cursor`.
- **Output**: List of normalized items.

### `shopify.search_products` (Optional)
Direct search against the store (via feed or direct API).
- **Input**: `query`
