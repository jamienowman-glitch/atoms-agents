# Shopify Feed Engine Contract v0

## Overview
This contract defines the API and data model for the Shopify Feed Engine.

## Data Model

### Feed Definition
```json
{
  "feed_id": "feed_sh_...",
  "name": "Main Catalog",
  "shop_domain": "mystore.myshopify.com",
  "feed_type": "products", 
  "source": "storefront_api",
  "filters": {
    "collections": ["frontpage"],
    "in_stock_only": true
  },
  "created_at": "ISO8601"
}
```

### Feed Item: Product
Normalized shape for Multi-21.
```json
{
  "item_id": "gid://shopify/Product/123",
  "feed_id": "feed_sh_...",
  "title": "Cool T-Shirt",
  "handle": "cool-t-shirt",
  "product_url": "https://mystore.com/products/cool-t-shirt",
  "images": ["https://.../pic.jpg"],
  "price_min": "19.99",
  "price_max": "29.99",
  "currency": "USD",
  "variants": [
    {
      "id": "gid://shopify/ProductVariant/456",
      "title": "Large / Red",
      "price": "29.99",
      "available": true
    }
  ],
  "ingested_at": "ISO8601"
}
```

## API Endpoints

### Feed Management
- `POST /feeds/shopify`: Create feed.
- `GET /feeds/shopify`: List feeds.
- `GET /feeds/shopify/{feed_id}`: Get feed.

### Feed Items
- `GET /feeds/shopify/{feed_id}/items`: Get items (pagination: limit/cursor).

### Refresh & Realtime
- `POST /feeds/shopify/{feed_id}:refresh`: Trigger ingestion.
- `GET /sse/feeds/shopify/{feed_id}`: SSE stream. Event: `shopify_feed.updated`.
