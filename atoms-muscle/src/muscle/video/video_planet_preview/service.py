from __future__ import annotations

"""Task 3 Implementation: orchestrate the surface render + runner automation with GPU/CPU preview plans."""

from typing import Any


class PlanetPreviewService:
    """Builds preview plans that span WebGL-forward flows and CPU fallbacks."""

    def __init__(self, default_resolution: tuple[int, int] = (1920, 1080)) -> None:
        self.default_resolution = default_resolution

    def create_preview_plan(
        self,
        run_metadata: dict[str, Any],
        resolution: dict[str, int] | None = None,
        device_capability: str = "gpu",
        strategy: str | None = None,
        duration_ms: int | None = None,
        surface_slug: str = "planet-surface",
    ) -> dict[str, Any]:
        """Compose the preview_plan bundle described in planetary-fps-spec."""
        width = resolution.get("width", self.default_resolution[0]) if resolution else self.default_resolution[0]
        height = resolution.get("height", self.default_resolution[1]) if resolution else self.default_resolution[1]
        duration = duration_ms or run_metadata.get("run_duration_ms", 60000)
        device_capability = device_capability.lower()
        strategy = strategy or ("webgl" if device_capability == "gpu" else "cpu-fallback")

        assets = self._surface_assets(surface_slug, strategy, run_metadata)
        timeline = self._assemble_timeline(run_metadata)
        actions = self._compose_action_tokens(run_metadata, strategy)

        return {
            "preview_plan": {
                "strategy": strategy,
                "duration_ms": duration,
                "resolution": {"width": width, "height": height},
                "device_capability": device_capability,
                "assets": assets,
                "timeline": timeline,
                "actions": actions,
            }
        }

    def _surface_assets(self, slug: str, strategy: str, run_metadata: dict[str, Any]) -> dict[str, Any]:
        base_uri = f"media_v2://planet_surface/{slug}"
        assets: dict[str, Any] = {
            "surface_render": {
                "stream": f"{base_uri}/stream",
                "atlas_hash": run_metadata.get("atlas_hash", "unknown"),
            },
            "lighting_gel": {
                "gradient": f"{base_uri}/lighting/gradient",
            },
        }
        if strategy == "cpu-fallback":
            assets["proxy_video"] = self._cpu_proxy_payload(slug)
        else:
            assets["gpu_proxy"] = {"hint": "WebGL-ready textures preloaded via media_v2"}
        return assets

    def _cpu_proxy_payload(self, slug: str) -> dict[str, Any]:
        # Documented fallback that approximates a video_render call when WebGL isn’t available.
        return {
            "media_uri": f"media_v2://planet_surface/{slug}/proxy_cpu.mp4",
            "renderer": "video_render",
            "note": "Call video_render to generate a proxy when GPU acceleration is unavailable.",
        }

    def _assemble_timeline(self, run_metadata: dict[str, Any]) -> dict[str, Any]:
        keyframes = run_metadata.get("keyframes", [])
        return {
            "keyframe_count": len(keyframes),
            "first_frame_timestamp": keyframes[0]["timestamp_ms"] if keyframes else 0,
            "preview_track": [
                {
                    "timestamp_ms": frame["timestamp_ms"],
                    "normal": frame["normal"],
                }
                for frame in keyframes[:3]
            ],
        }

    def _compose_action_tokens(self, run_metadata: dict[str, Any], strategy: str) -> list[dict[str, Any]]:
        return [
            {
                "type": "timeline_sync",
                "target": "video_timeline",
                "payload": {"keyframes": run_metadata.get("keyframes", [])},
            },
            {
                "type": "focus",
                "target": "video_focus_automation",
                "payload": {
                    "strategy": strategy,
                    "duration_ms": run_metadata.get("run_duration_ms", 60000),
                },
            },
        ]

    def run(self, input_path: str, **kwargs: Any) -> dict[str, Any]:
        """Standard MCP entry that proxies to create_preview_plan."""
        return self.create_preview_plan(
            run_metadata=kwargs.get("run_metadata", {}),
            resolution=kwargs.get("resolution"),
            device_capability=kwargs.get("device_capability", "gpu"),
            strategy=kwargs.get("strategy"),
            duration_ms=kwargs.get("duration_ms"),
            surface_slug=kwargs.get("surface_slug", "planet-surface"),
        )
