from __future__ import annotations

"""Thin wrapper for planet runner muscle."""

from typing import Any

from atoms_core.src.video.planet.runner import PlanetRunner


class PlanetRunnerService:
    """MCP service wrapper for planet runner."""
    
    def __init__(
        self, 
        planet_radius: float = 3390.0, 
        frame_rate: int = 30, 
        base_speed: float = 6.0
    ) -> None:
        self._runner = PlanetRunner(planet_radius, frame_rate, base_speed)
    
    def simulate_run(
        self,
        run_duration_ms: int,
        speed_profile: list[dict[str, float]] | None = None,
        start_heading_deg: float = 0.0,
        start_lat_deg: float = 0.0,
        start_lon_deg: float = 0.0,
    ) -> dict[str, Any]:
        """Delegate to atoms-core implementation."""
        return self._runner.simulate_run(
            run_duration_ms, 
            speed_profile, 
            start_heading_deg, 
            start_lat_deg, 
            start_lon_deg
        )
    
    def run_plan(self, **kwargs: Any) -> dict[str, Any]:
        """Legacy automation alias that the preview muscle can call."""
        return self.simulate_run(
            run_duration_ms=int(kwargs.get("run_duration_ms", kwargs.get("duration_ms", 60000))),
            speed_profile=kwargs.get("speed_profile"),
            start_heading_deg=kwargs.get("heading", 0.0),
        )
    
    def run(self, input_path: str, **kwargs: Any) -> dict[str, Any]:
        """MCP entry point; proxies to run_plan for compatibility."""
        return self.run_plan(**kwargs)
