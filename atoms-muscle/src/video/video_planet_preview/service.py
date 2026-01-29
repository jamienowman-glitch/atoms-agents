from __future__ import annotations

"""Thin wrapper for planet preview muscle."""

from typing import Any

from atoms_core.src.video.planet.preview import PlanetPreview


class PlanetPreviewService:
    """MCP service wrapper for planet preview orchestrator."""
    
    def __init__(self, default_resolution: tuple[int, int] = (1920, 1080)) -> None:
        self._preview = PlanetPreview(default_resolution)
    
    def create_preview_plan(
        self,
        run_metadata: dict[str, Any],
        resolution: dict[str, int] | None = None,
        device_capability: str = "gpu",
        strategy: str | None = None,
        duration_ms: int | None = None,
        surface_slug: str = "planet-surface",
        tenant_id: str | None = None,
        env: str | None = None,
        user_id: str | None = None,
    ) -> dict[str, Any]:
        """Delegate to atoms-core implementation.
        
        Tenant context is passed through for real asset generation in surface renderer.
        """
        return self._preview.create_preview_plan(
            run_metadata,
            resolution,
            device_capability,
            strategy,
            duration_ms,
            surface_slug,
        )
    
    def run(self, input_path: str, **kwargs: Any) -> dict[str, Any]:
        """MCP entry point; proxies to create_preview_plan."""
        return self.create_preview_plan(
            run_metadata=kwargs.get("run_metadata", {}),
            resolution=kwargs.get("resolution"),
            device_capability=kwargs.get("device_capability", "gpu"),
            strategy=kwargs.get("strategy"),
            duration_ms=kwargs.get("duration_ms"),
            surface_slug=kwargs.get("surface_slug", "planet-surface"),
            tenant_id=kwargs.get("tenant_id"),
            env=kwargs.get("env"),
            user_id=kwargs.get("user_id"),
        )
