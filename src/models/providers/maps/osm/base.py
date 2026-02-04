
"""OpenStreetMap helpers for routing + geocoding."""
import asyncio
from typing import Any, Dict, Optional

import requests

from atoms_agents.src.models.providers.common import log_inference_event

class OsmProviderBase:
    PROVIDER_ID = "prov_osm"
    ROUTING_URL = "https://routing.openstreetmap.de/routed-car/route/v1/driving"
    GEOCODE_URL = "https://nominatim.openstreetmap.org/search"

    def route(self, coordinates: str) -> Dict[str, Any]:
        url = f"{self.ROUTING_URL}/{coordinates}"
        params = {"overview": "full", "geometries": "polyline"}
        response = requests.get(url, params=params, timeout=30)
        response.raise_for_status()
        return response.json()

    def geocode(self, query: str) -> Any:
        response = requests.get(self.GEOCODE_URL, params={"q": query, "format": "json"}, timeout=30)
        response.raise_for_status()
        return response.json()

    async def _log_response(
        self,
        query: str,
        result: Optional[str],
        canvas_id: Optional[str],
        thread_id: Optional[str],
        actor_id: str,
        error: Optional[str] = None,
    ) -> None:
        await log_inference_event(
            provider_id=self.PROVIDER_ID,
            model_id="osm",
            input_text=query,
            output_text=result,
            tokens_used=0,
            cost=0.0,
            error=error,
            canvas_id=canvas_id,
            thread_id=thread_id,
            actor_id=actor_id,
        )
