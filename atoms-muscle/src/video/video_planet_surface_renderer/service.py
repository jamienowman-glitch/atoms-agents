from __future__ import annotations

"""Task 1 Implementation: procedural hemisphere rendering with per-frame metadata for preview consumers."""

import hashlib
import math
from dataclasses import dataclass
from typing import Any

import numpy as np


@dataclass
class FrameDescriptor:
    """Helper dataclass to keep generated sample metadata structured."""

    timestamp_ms: int
    media_uri: str
    lighting: dict[str, Any]
    curvature: dict[str, float]
    sample_chunk: list[float]


class PlanetSurfaceRendererService:
    """Implements the glowing planetary surface renderer described in planetary-fps-spec."""

    def __init__(self, base_frame_rate: int = 24, sample_density: int = 16) -> None:
        self.base_frame_rate = base_frame_rate
        self.sample_density = sample_density

    def render(self, surface_params: dict[str, Any], duration_ms: int, frame_rate: int | None = None) -> dict[str, Any]:
        """Render a sequence of hemisphere frames with metadata that preview muscles can consume."""
        target_rate = frame_rate or self.base_frame_rate
        frame_count = max(1, math.ceil((duration_ms / 1000.0) * target_rate))
        radius = float(surface_params.get("radius", 3390.0))
        glow_strength = float(surface_params.get("glow_strength", 0.8))
        atmosphere = float(surface_params.get("atmosphere", 0.3))
        render_instructions = self._build_equirectangular_texture(surface_params, radius)

        frames: list[dict[str, Any]] = []
        for index in range(frame_count):
            progress = index / max(1, frame_count - 1)
            timestamp_ms = int(progress * duration_ms)
            lighting = self._lighting_profile(progress, glow_strength, atmosphere)
            curvature = self._estimate_curvature(radius, progress)
            descriptor = FrameDescriptor(
                timestamp_ms=timestamp_ms,
                media_uri=self._frame_media_uri(surface_params, index),
                lighting=lighting,
                curvature=curvature,
                sample_chunk=self._slice_samples(render_instructions, index),
            )
            frames.append(descriptor.__dict__)

        return {
            "frames": frames,
            "metadata": {
                "surface_params": surface_params,
                "duration_ms": duration_ms,
                "frame_rate": target_rate,
                "atlas_hash": self._shader_fingerprint(render_instructions),
            },
        }

    def _build_equirectangular_texture(self, surface_params: dict[str, Any], radius: float) -> np.ndarray:
        """Sample a simple equirectangular hemisphere mesh to drive preview textures."""
        sample_count = self.sample_density
        latitudes = np.linspace(0.0, math.pi / 2, sample_count)
        longitudes = np.linspace(0.0, 2 * math.pi, sample_count)
        lat_grid, lon_grid = np.meshgrid(latitudes, longitudes, indexing="ij")
        x = radius * np.cos(lat_grid) * np.cos(lon_grid)
        y = radius * np.cos(lat_grid) * np.sin(lon_grid)
        z = radius * np.sin(lat_grid)
        emissive = np.sin(lat_grid * 2) * surface_params.get("emissive_variation", 0.5)
        curvature = (x**2 + y**2 + z**2) / radius**2
        texture = np.stack([x, y, z, emissive, curvature], axis=-1)
        return texture

    def _slice_samples(self, atlas: np.ndarray, frame_index: int) -> list[float]:
        """Provide a stable chunk of the atlas so each frame can reference a shrink-wrapped parcel."""
        flat = atlas.reshape(-1, atlas.shape[-1])
        sample_index = frame_index % flat.shape[0]
        slice_window = flat[sample_index : sample_index + 1]
        return slice_window.flatten().tolist()

    def _lighting_profile(self, progress: float, glow_strength: float, atmosphere: float) -> dict[str, float]:
        sun_angle = math.cos(progress * math.pi)
        emissive = (1.0 - atmosphere) * glow_strength + (atmosphere * progress)
        return {
            "sun_angle": sun_angle,
            "emissive": round(emissive, 3),
            "bloom": min(1.0, glow_strength + 0.1 * progress),
        }

    def _estimate_curvature(self, radius: float, progress: float) -> dict[str, float]:
        return {
            "radius": radius,
            "surface_variance": 1.0 + 0.3 * math.sin(progress * math.pi * 2),
        }

    def _frame_media_uri(self, surface_params: dict[str, Any], frame_index: int) -> str:
        slug = surface_params.get("slug") or self._slug_surface(surface_params)
        return f"media_v2://planet_surface/{slug}/frame_{frame_index:04d}"  # Documented URI for media_v2 consumers

    def _slug_surface(self, surface_params: dict[str, Any]) -> str:
        payload = f"{surface_params}-{surface_params.get('glow_strength', 0.0)}"
        return hashlib.sha1(payload.encode("utf-8")).hexdigest()[:8]

    def _shader_fingerprint(self, atlas: np.ndarray) -> str:
        hasher = hashlib.sha256()
        hasher.update(atlas.tobytes())
        return hasher.hexdigest()

    def run(self, input_path: str, **kwargs: Any) -> dict[str, Any]:
        """Skill entry point: proxies legacy MCP signature to `render`. """
        surface_params = kwargs.get("surface_params", {})
        duration_ms = int(kwargs.get("duration_ms", kwargs.get("duration", 1000)))
        return self.render(surface_params, duration_ms, frame_rate=kwargs.get("frame_rate"))


if __name__ == "__main__":
    service = PlanetSurfaceRendererService()
    example = service.render({"radius": 2000, "glow_strength": 0.9, "slug": "luminous"}, duration_ms=2000)
    print("Smoke test: first frame", example["frames"][0]["media_uri"])
    print("Atlas hash", example["metadata"]["atlas_hash"])
