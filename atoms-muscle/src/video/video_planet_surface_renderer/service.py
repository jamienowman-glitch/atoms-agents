from __future__ import annotations

"""Thin wrapper for planet surface renderer muscle."""

from typing import Any
import hashlib
import math

from atoms_core.src.video.planet.surface_renderer import PlanetSurfaceRenderer
from atoms_core.src.event_spine.repository import EventRepository


class PlanetSurfaceRendererService:
    """MCP service wrapper for planet surface renderer."""
    
    def __init__(self, base_frame_rate: int = 24, sample_density: int = 16) -> None:
        self._renderer = PlanetSurfaceRenderer(base_frame_rate, sample_density)
    
    def render(
        self, 
        surface_params: dict[str, Any], 
        duration_ms: int, 
        frame_rate: int | None = None,
        tenant_id: str | None = None,
        env: str | None = None,
        user_id: str | None = None,
    ) -> dict[str, Any]:
        """Delegate to atoms-core implementation.
        
        If tenant_id is provided, uses production path (real S3 assets).
        Otherwise uses placeholder URIs (dev/test path).
        """
        heatmap_payload = None
        if tenant_id:
            heatmap_payload = self._fetch_heatmap_data(tenant_id)

        if tenant_id and env:
            # Production path: generate real assets
            return self._renderer.render_with_assets(
                surface_params=surface_params,
                duration_ms=duration_ms,
                tenant_id=tenant_id,
                env=env,
                user_id=user_id,
                frame_rate=frame_rate,
                heatmap_payload=heatmap_payload,
            )
        else:
            # Dev/test path: placeholder URIs
            return self._renderer.render(
                surface_params,
                duration_ms,
                frame_rate,
                heatmap_payload=heatmap_payload
            )

    def _fetch_heatmap_data(self, tenant_id: str) -> list[dict[str, Any]]:
        """Fetch nexus.search_hit events and transform to heatmap payload."""
        try:
            repo = EventRepository()
            events = repo.get_recent_events_by_type(tenant_id, "nexus.search_hit", limit=100)
            heatmap = []
            for event in events:
                # Extract payload data
                payloads = event.get("event_spine_v2_payloads", [])
                data = {}
                if payloads and isinstance(payloads[0], dict):
                    data = payloads[0].get("data", {})

                # Determine location from search_id or event_id
                seed = data.get("search_id") or event.get("id") or "unknown"
                lat, lon = self._hash_to_coords(str(seed))

                # Determine intensity from score (if available)
                # Assuming score is 0.0-1.0, or normalize it.
                score = float(data.get("score", 0.5))
                intensity = max(0.1, min(1.0, score))

                heatmap.append({
                    "lat": lat,
                    "lon": lon,
                    "intensity": intensity
                })
            return heatmap
        except Exception as e:
            print(f"Error fetching heatmap data: {e}")
            return []

    def _hash_to_coords(self, input_str: str) -> tuple[float, float]:
        """Deterministically map a string to lat (0..pi/2) and lon (0..2pi)."""
        h = hashlib.sha256(input_str.encode()).digest()
        # Use first 4 bytes for lat, next 4 for lon
        lat_int = int.from_bytes(h[:4], 'big')
        lon_int = int.from_bytes(h[4:8], 'big')

        # Lat: 0 to pi/2
        lat = (lat_int / 0xFFFFFFFF) * (math.pi / 2)
        # Lon: 0 to 2pi
        lon = (lon_int / 0xFFFFFFFF) * (2 * math.pi)
        return lat, lon
    
    def run(self, input_path: str, **kwargs: Any) -> dict[str, Any]:
        """MCP entry point."""
        surface_params = kwargs.get("surface_params", {})
        duration_ms = int(kwargs.get("duration_ms", kwargs.get("duration", 1000)))
        
        # Extract tenant context from kwargs (provided by MCP framework)
        tenant_id = kwargs.get("tenant_id")
        env = kwargs.get("env", "prod")
        user_id = kwargs.get("user_id")
        
        return self.render(
            surface_params=surface_params,
            duration_ms=duration_ms,
            frame_rate=kwargs.get("frame_rate"),
            tenant_id=tenant_id,
            env=env,
            user_id=user_id,
        )


if __name__ == "__main__":
    service = PlanetSurfaceRendererService()
    # Dev smoke test (no tenant_id = placeholder URIs)
    example = service.render(
        {"radius": 2000, "glow_strength": 0.9, "slug": "luminous"}, 
        duration_ms=2000
    )
    print("Smoke test: first frame", example["frames"][0]["media_uri"])
    print("Atlas hash", example["metadata"]["atlas_hash"])
