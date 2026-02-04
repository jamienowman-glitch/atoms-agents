
"""Google Maps helpers for routing + elevation."""
import asyncio
from typing import Any, Dict, Optional

import requests

from atoms_agents.src.models.providers.common import log_inference_event, require_secret

BASE_URL = "https://maps.googleapis.com/maps/api"


class GoogleMapsProviderBase:
    PROVIDER_ID = "prov_google_maps"

    def __init__(self) -> None:
        self.api_key = require_secret(
            "GOOGLE_MAPS_API_KEY",
            "google-maps-key.txt",
            "google_maps_api_key.txt",
            "google_maps.txt",
        )
        self.session = requests.Session()

    def _route(self, origin: str, destination: str) -> Dict[str, Any]:
        url = f"{BASE_URL}/directions/json"
        params = {
            "origin": origin,
            "destination": destination,
            "key": self.api_key,
        }
        response = self.session.get(url, params=params, timeout=30)
        response.raise_for_status()
        return response.json()

    def _elevation(self, location: str) -> Dict[str, Any]:
        url = f"{BASE_URL}/elevation/json"
        params = {"locations": location, "key": self.api_key}
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
            model_id="google-maps",
            input_text=query,
            output_text=result,
            tokens_used=0,
            cost=0.0,
            error=error,
            canvas_id=canvas_id,
            thread_id=thread_id,
            actor_id=actor_id,
        )
