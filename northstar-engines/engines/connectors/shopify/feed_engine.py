from __future__ import annotations

import logging
import asyncio
import os
import json
from typing import List, Optional, Dict, Any
from uuid import uuid4
from datetime import datetime

import httpx
from engines.common.identity import RequestContext
from engines.workbench.local_secrets import LocalSecretStore
from engines.common.dev_keys import DevKeyLoader
from engines.connectors.shopify.feed_store import FeedStore, FeedDefinition, FeedItem

logger = logging.getLogger(__name__)

class FeedEngine:
    def __init__(self):
        self.store = FeedStore()
        self.secrets = LocalSecretStore()
        self.dev_keys = DevKeyLoader("shopify")

    # ... methods ...

    async def get_items(self, ctx: RequestContext, feed_id: str, limit: int = 20, cursor: Optional[str] = None) -> List[FeedItem]:
        return self.store.get_items(ctx, feed_id, limit, cursor)

    async def refresh_feed(self, ctx: RequestContext, feed_id: str) -> Dict[str, Any]:
        feed = await self.get_feed(ctx, feed_id)
        if not feed:
            raise ValueError(f"Feed {feed_id} not found")

        # Get Credentials
        token = self.dev_keys.get("SHOPIFY_STOREFRONT_TOKEN")
        
        if not token:
            # Fallback for transition
            token = self.secrets.get_secret("shopify_storefront_token")
        
        if not token:
             raise ValueError(
                 "Missing 'SHOPIFY_STOREFRONT_TOKEN'. Please add it to 'jaynowman/northstar-keys/shopify.dev.json'. "
                 "See docs/contracts/feeds/DEV_KEYS_SETUP.md"
             )

        shop = feed.shop_domain
        if not shop.endswith("myshopify.com") and "." not in shop:
             shop = f"{shop}.myshopify.com"

        # Check for version override
        version = self.dev_keys.get("SHOPIFY_API_VERSION") or "2024-01"

        url = f"https://{shop}/api/{version}/graphql.json"
        headers = {
            "Content-Type": "application/json",
            "X-Shopify-Storefront-Access-Token": token
        }
        feed_id = f"feed_sh_{uuid4().hex[:8]}"
        feed = FeedDefinition(
            feed_id=feed_id,
            name=name,
            shop_domain=shop_domain,
            feed_type=feed_type,
            tenant_id=ctx.tenant_id,
            project_id=ctx.project_id,
            surface_id=ctx.surface_id,
            filters=filters or {},
            source="storefront_api" # default V0
        )
        return self.store.upsert_feed(ctx, feed)

    async def get_feed(self, ctx: RequestContext, feed_id: str) -> Optional[FeedDefinition]:
        return self.store.get_feed(ctx, feed_id)
    
    async def list_feeds(self, ctx: RequestContext) -> List[FeedDefinition]:
        return self.store.list_feeds(ctx)

    async def get_items(self, ctx: RequestContext, feed_id: str, limit: int = 20, cursor: Optional[str] = None) -> List[FeedItem]:
        return self.store.get_items(ctx, feed_id, limit, cursor)

    async def refresh_feed(self, ctx: RequestContext, feed_id: str) -> Dict[str, Any]:
        feed = await self.get_feed(ctx, feed_id)
        if not feed:
            raise ValueError(f"Feed {feed_id} not found")

        # Get Credentials
        token = self.secrets.get_secret("shopify_storefront_token")
        
        # If no strict token, check tenant specific or fallback
        # Ideally user configured this via secrets
        if not token:
             # Try admin token (not ideal for storefront query, but V0 might use admin API if storefront unsupported?)
             # Wait, Storefront API has different endpoint. 
             # Let's stick to storefront pattern requested.
             token = self.secrets.get_secret(f"shopify-storefront-token-{ctx.tenant_id}")
        
        if not token:
             raise ValueError("Missing 'shopify_storefront_token'. Please set it in secrets.")

        shop = feed.shop_domain
        if not shop.endswith("myshopify.com") and "." not in shop:
             shop = f"{shop}.myshopify.com"

        url = f"https://{shop}/api/2024-01/graphql.json"
        headers = {
            "Content-Type": "application/json",
            "X-Shopify-Storefront-Access-Token": token
        }

        async with httpx.AsyncClient() as client:
            items = []
            if feed.feed_type == "products":
                items = await self._fetch_products(client, url, headers)
            elif feed.feed_type == "collections":
                items = await self._fetch_collections(client, url, headers)
            
            # Persist
            # Map to FeedItem (done in fetchers)
            # Add feed_id
            for i in items:
                i.feed_id = feed_id
                
            self.store.upsert_items(ctx, items)
            
            return {
                "status": "success",
                "ingested_count": len(items),
                "feed_id": feed_id
            }

    async def _fetch_products(self, client, url, headers) -> List[FeedItem]:
        query = """
        query {
          products(first: 20) {
            edges {
              node {
                id
                title
                handle
                onlineStoreUrl
                images(first: 1) { edges { node { url } } }
                priceRange { minVariantPrice { amount currencyCode } maxVariantPrice { amount currencyCode } }
                variants(first: 10) { edges { node { id title price { amount } availableForSale } } }
              }
            }
          }
        }
        """
        resp = await client.post(url, json={"query": query}, headers=headers)
        resp.raise_for_status()
        data = resp.json()
        
        if "errors" in data:
            logger.error(f"Shopify Errors: {data['errors']}")
            raise RuntimeError(f"Shopify Query Failed: {data['errors']}")

        results = []
        for edge in data["data"]["products"]["edges"]:
            node = edge["node"]
            
            image_url = ""
            if node["images"]["edges"]:
                image_url = node["images"]["edges"][0]["node"]["url"]

            variants = []
            for v_edge in node["variants"]["edges"]:
                v = v_edge["node"]
                variants.append({
                    "id": v["id"],
                    "title": v["title"],
                    "price": v["price"]["amount"],
                    "available": v["availableForSale"]
                })
            
            item = FeedItem(
                item_id=node["id"],
                feed_id="", # Set later
                title=node["title"],
                handle=node["handle"],
                url=node["onlineStoreUrl"] or f"https://placeholder/{node['handle']}",
                images=[image_url] if image_url else [],
                price_min=node["priceRange"]["minVariantPrice"]["amount"],
                price_max=node["priceRange"]["maxVariantPrice"]["amount"],
                currency=node["priceRange"]["minVariantPrice"]["currencyCode"],
                variants=variants
            )
            results.append(item)
        return results

    async def _fetch_collections(self, client, url, headers) -> List[FeedItem]:
        query = """
        query {
          collections(first: 20) {
            edges {
              node {
                id
                title
                handle
                onlineStoreUrl
                image { url }
                products(first: 0) { totalCount }
              }
            }
          }
        }
        """
        resp = await client.post(url, json={"query": query}, headers=headers)
        resp.raise_for_status()
        data = resp.json()
        
        if "errors" in data:
            raise RuntimeError(f"Shopify Query Failed: {data['errors']}")

        results = []
        for edge in data["data"]["collections"]["edges"]:
            node = edge["node"]
            
            image_url = ""
            if node.get("image"):
                image_url = node["image"]["url"]

            item = FeedItem(
                item_id=node["id"],
                feed_id="",
                title=node["title"],
                handle=node["handle"],
                url=node["onlineStoreUrl"] or f"https://placeholder/collections/{node['handle']}",
                images=[image_url] if image_url else [],
                product_count=node.get("products", {}).get("totalCount", 0)
            )
            results.append(item)
        return results
