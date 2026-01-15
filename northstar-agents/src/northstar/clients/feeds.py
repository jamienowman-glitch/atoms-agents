from typing import Any, List, Dict
from .http_base import BaseHttpClient


class FeedsClient(BaseHttpClient):
    """
    Client for Feed operations.
    """

    async def get_summary(self) -> Dict[str, Any]:
        """Returns grouped feeds for pickers."""
        return await self._request("GET", "feeds/summary")

    async def list_feeds(self, kind: str) -> List[Dict[str, Any]]:
        return await self._request("GET", f"feeds/{kind}")

    async def create_feed(self, kind: str, config: Dict[str, Any]) -> Dict[str, Any]:
        return await self._request("POST", f"feeds/{kind}", json_data=config)

    async def refresh_feed(self, kind: str, feed_id: str) -> Dict[str, Any]:
        return await self._request("POST", f"feeds/{kind}/{feed_id}:refresh")

    async def get_feed_items(
        self, kind: str, feed_id: str, limit: int = 20
    ) -> List[Dict[str, Any]]:
        return await self._request(
            "GET", f"feeds/{kind}/{feed_id}/items", params={"limit": limit}
        )
