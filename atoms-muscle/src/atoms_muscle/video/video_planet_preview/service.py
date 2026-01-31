from __future__ import annotations

"""Thin wrapper for planet preview muscle."""

from typing import Any

from atoms_core.src.video.planet.preview import PlanetPreview
from src.video.video_planet_runner.service import PlanetRunnerService
from src.video.video_planet_surface_renderer.service import PlanetSurfaceRendererService


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
        surface_params: dict[str, Any] | None = None,
        tenant_id: str | None = None,
        env: str | None = None,
        user_id: str | None = None,
    ) -> dict[str, Any]:
        """Orchestrate runner and surface renderer, then build preview plan.
        
        Tenant context is passed through for real asset generation in surface renderer.
        """
        # 1. Orchestrate Runner if keyframes are missing
        if not run_metadata.get("keyframes"):
            runner = PlanetRunnerService()
            # Extract runner params from run_metadata or use defaults
            r_duration = duration_ms or run_metadata.get("run_duration_ms", 60000)
            r_speed = run_metadata.get("speed_profile")
            r_heading = run_metadata.get("heading", 0.0)

            run_result = runner.simulate_run(
                run_duration_ms=r_duration,
                speed_profile=r_speed,
                start_heading_deg=r_heading
            )
            # Update run_metadata with result (keyframes, metadata)
            run_metadata.update(run_result)
            if not duration_ms:
                duration_ms = run_result["metadata"]["run_duration_ms"]

        # 2. Orchestrate Surface Renderer
        # We must call this to ensure assets exist (especially for real assets with heatmap)
        surface = PlanetSurfaceRendererService()
        s_params = surface_params or {"slug": surface_slug}

        surface_result = surface.render(
            surface_params=s_params,
            duration_ms=duration_ms or 60000,
            tenant_id=tenant_id,
            env=env,
            user_id=user_id
        )

        # 3. Integrate Surface Metadata
        # Update slug and hash to match what was generated/rendered
        generated_slug = surface_result["metadata"]["slug"]
        atlas_hash = surface_result["metadata"]["atlas_hash"]
        run_metadata["atlas_hash"] = atlas_hash

        return self._preview.create_preview_plan(
            run_metadata,
            resolution,
            device_capability,
            strategy,
            duration_ms,
            surface_slug=generated_slug,
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
            surface_params=kwargs.get("surface_params"),
            tenant_id=kwargs.get("tenant_id"),
            env=kwargs.get("env"),
            user_id=kwargs.get("user_id"),
        )
