import httpx
from typing import Optional, Any, Dict
import logging

logger = logging.getLogger(__name__)


class BaseHttpClient:
    """
    Atomic base class for all Engine Clients.
    Handles Auth headers and basic error handling.
    """

    def __init__(self, base_url: str, api_key: Optional[str] = None):
        self.base_url = base_url.rstrip("/")
        self.headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}" if api_key else "",
        }

    async def _request(
        self, method: str, path: str, json_data: Any = None, params: Any = None
    ) -> Dict[str, Any]:
        url = f"{self.base_url}/{path.lstrip('/')}"

        async with httpx.AsyncClient() as client:
            try:
                resp = await client.request(
                    method,
                    url,
                    json=json_data,
                    params=params,
                    headers=self.headers,
                    timeout=10.0,
                )
                resp.raise_for_status()
                return resp.json()
            except httpx.HTTPStatusError as e:
                logger.error(
                    f"HTTP Error {e.response.status_code} for {url}: {e.response.text}"
                )
                raise
            except Exception as e:
                logger.error(f"Request failed: {e}")
                raise
