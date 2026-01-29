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
        frame_rate: int | None = None,
        tenant_id: str | None = None,
        env: str | None = None,
        user_id: str | None = None,
    ) -> dict[str, Any]:
        """Delegate to atoms-core implementation.
        
        If tenant_id is provided, uses production path (real S3 assets).
        Otherwise uses placeholder URIs (dev/test path).
        """
        if tenant_id and env:
            # Production path: generate real assets
            return self._renderer.render_with_assets(
                surface_params=surface_params,
                duration_ms=duration_ms,
                tenant_id=tenant_id,
                env=env,
                user_id=user_id,
                frame_rate=frame_rate,
            )
        else:
            # Dev/test path: placeholder URIs
            return self._renderer.render(surface_params, duration_ms, frame_rate)
    
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
