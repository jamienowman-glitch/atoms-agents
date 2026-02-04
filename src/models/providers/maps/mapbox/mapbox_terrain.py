"""MapboxTerrainProvider wrapper for terrain."""
import asyncio
import json
from typing import Dict, Optional

from atoms_agents.src.models.providers.maps.mapbox.base import MapboxProviderBase


class MapboxTerrainProvider(MapboxProviderBase):
    async def describe_terrain(
        self,
        lon: float, lat: float,
        *,
        canvas_id: Optional[str] = None,
        thread_id: Optional[str] = None,
        actor_id: str = "system",
    ) -> Dict[str, Any]:
        try:
            payload = await asyncio.to_thread(self._terrain, lon, lat)
            await self._log_response(
                query=f"terrain:{lon},{lat}",
                result=json.dumps(payload),
                canvas_id=canvas_id,
                thread_id=thread_id,
                actor_id=actor_id,
            )
            return payload
        except Exception as exc:  # pragma: no cover - external call
            await self._log_response(
                query=f"terrain:{lon},{lat}",
                result=None,
                canvas_id=canvas_id,
                thread_id=thread_id,
                actor_id=actor_id,
                error=str(exc),
            )
            raise
