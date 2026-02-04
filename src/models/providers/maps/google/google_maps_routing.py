"""GoogleMapsRoutingProvider wrapper for routing."""
import asyncio
import json
from typing import Dict, Optional

from atoms_agents.src.models.providers.maps.google.base import GoogleMapsProviderBase


class GoogleMapsRoutingProvider(GoogleMapsProviderBase):
    async def calculate_route(
        self,
        origin: str, destination: str,
        *,
        canvas_id: Optional[str] = None,
        thread_id: Optional[str] = None,
        actor_id: str = "system",
    ) -> Dict[str, Any]:
        try:
            payload = await asyncio.to_thread(self._route, origin, destination)
            await self._log_response(
                query=f"route:{origin}->{destination}",
                result=json.dumps(payload),
                canvas_id=canvas_id,
                thread_id=thread_id,
                actor_id=actor_id,
            )
            return payload
        except Exception as exc:  # pragma: no cover - external call
            await self._log_response(
                query=f"route:{origin}->{destination}",
                result=None,
                canvas_id=canvas_id,
                thread_id=thread_id,
                actor_id=actor_id,
                error=str(exc),
            )
            raise
