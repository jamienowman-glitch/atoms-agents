
"""Mapbox helpers for routing + terrain."""
import asyncio
from typing import Any, Dict, Optional

import requests

from atoms_agents.src.models.providers.common import log_inference_event, require_secret

class MapboxProviderBase:
    PROVIDER_ID = "prov_mapbox"
    BASE_URL = "https://api.mapbox.com"

    def __init__(self) -> None:
        self.api_key = require_secret(
            "MAPBOX_API_KEY",
            "mapbox-key.txt",
            "mapbox_api_key.txt",
            "mapbox.txt",
        )
        self.session = requests.Session()

    def _route(self, coordinates: str) -> Dict[str, Any]:
        url = f"{self.BASE_URL}/directions/v5/mapbox/driving/{coordinates}"
        params = {
            "access_token": self.api_key,
            "overview": "full",
            "geometries": "polyline",
        }
        response = self.session.get(url, params=params, timeout=30)
        response.raise_for_status()
        return response.json()

    def _terrain(self, lon: float, lat: float) -> Dict[str, Any]:
        url = f"{self.BASE_URL}/v4/mapbox.mapbox-terrain-v2/tilequery/{lon},{lat}.json"
        params = {"access_token": self.api_key, "limit": 1}
        response = self.session.get(url, params=params, timeout=30)
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
            model_id="mapbox",
            input_text=query,
            output_text=result,
            tokens_used=0,
            cost=0.0,
            error=error,
            canvas_id=canvas_id,
            thread_id=thread_id,
            actor_id=actor_id,
        )
