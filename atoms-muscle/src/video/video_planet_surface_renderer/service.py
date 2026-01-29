from __future__ import annotations

"""Thin wrapper for planet surface renderer muscle."""

from typing import Any

from atoms_core.src.video.planet.surface_renderer import PlanetSurfaceRenderer


class PlanetSurfaceRendererService:
    """MCP service wrapper for planet surface renderer."""
    
    def __init__(self, base_frame_rate: int = 24, sample_density: int = 16) -> None:
        self._renderer = PlanetSurfaceRenderer(base_frame_rate, sample_density)
    
    def render(
        self, 
        surface_params: dict[str, Any], 
        duration_ms: int, 
        frame_rate: int | None = None
    ) -> dict[str, Any]:
        """Delegate to atoms-core implementation."""
        return self._renderer.render(surface_params, duration_ms, frame_rate)
    
    def run(self, input_path: str, **kwargs: Any) -> dict[str, Any]:
        """MCP entry point."""
        surface_params = kwargs.get("surface_params", {})
        duration_ms = int(kwargs.get("duration_ms", kwargs.get("duration", 1000)))
        return self.render(surface_params, duration_ms, frame_rate=kwargs.get("frame_rate"))


if __name__ == "__main__":
    service = PlanetSurfaceRendererService()
    example = service.render(
        {"radius": 2000, "glow_strength": 0.9, "slug": "luminous"}, 
        duration_ms=2000
    )
    print("Smoke test: first frame", example["frames"][0]["media_uri"])
    print("Atlas hash", example["metadata"]["atlas_hash"])
