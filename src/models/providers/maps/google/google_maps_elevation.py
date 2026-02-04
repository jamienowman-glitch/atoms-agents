"""GoogleMapsElevationProvider wrapper for elevation."""
import asyncio
import json
from typing import Dict, Optional

from atoms_agents.src.models.providers.maps.google.base import GoogleMapsProviderBase


class GoogleMapsElevationProvider(GoogleMapsProviderBase):
    async def describe_elevation(
        self,
        location: str,
        *,
        canvas_id: Optional[str] = None,
        thread_id: Optional[str] = None,
        actor_id: str = "system",
    ) -> Dict[str, Any]:
        try:
            payload = await asyncio.to_thread(self._elevation, location)
            await self._log_response(
                query=f"elevation:{location}",
                result=json.dumps(payload),
                canvas_id=canvas_id,
                thread_id=thread_id,
                actor_id=actor_id,
            )
            return payload
        except Exception as exc:  # pragma: no cover - external call
            await self._log_response(
                query=f"elevation:{location}",
                result=None,
                canvas_id=canvas_id,
                thread_id=thread_id,
                actor_id=actor_id,
                error=str(exc),
            )
            raise
