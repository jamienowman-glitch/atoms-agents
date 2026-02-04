"""OsmGeocodingProvider wrapper for geocoding."""
import asyncio
import json
from typing import Dict, Optional

from atoms_agents.src.models.providers.maps.osm.base import OsmProviderBase


class OsmGeocodingProvider(OsmProviderBase):
    async def lookup_address(
        self,
        query: str,
        *,
        canvas_id: Optional[str] = None,
        thread_id: Optional[str] = None,
        actor_id: str = "system",
    ) -> Dict[str, Any]:
        try:
            payload = await asyncio.to_thread(self.geocode, query)
            await self._log_response(
                query=f"geocode:{query}",
                result=json.dumps(payload),
                canvas_id=canvas_id,
                thread_id=thread_id,
                actor_id=actor_id,
            )
            return payload
        except Exception as exc:  # pragma: no cover - external call
            await self._log_response(
                query=f"geocode:{query}",
                result=None,
                canvas_id=canvas_id,
                thread_id=thread_id,
                actor_id=actor_id,
                error=str(exc),
            )
            raise
