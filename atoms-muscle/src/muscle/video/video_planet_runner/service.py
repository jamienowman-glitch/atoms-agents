from __future__ import annotations

"""Task 2 Implementation: provide keyframe automation that locks the FPS camera to the spherical surface."""

import math
from typing import Any


def _normalize(vector: tuple[float, float, float]) -> tuple[float, float, float]:
    x, y, z = vector
    length = math.sqrt(x * x + y * y + z * z)
    if length == 0.0:
        return 0.0, 0.0, 0.0
    return x / length, y / length, z / length


class PlanetRunnerService:
    """Keeps a runner grounded on the sphere and emits keyframes with consistent normals."""

    def __init__(self, planet_radius: float = 3390.0, frame_rate: int = 30, base_speed: float = 6.0) -> None:
        self.planet_radius = planet_radius
        self.frame_rate = frame_rate
        self.base_speed = base_speed

    def simulate_run(
        self,
        run_duration_ms: int,
        speed_profile: list[dict[str, float]] | None = None,
        start_heading_deg: float = 0.0,
        start_lat_deg: float = 0.0,
        start_lon_deg: float = 0.0,
    ) -> dict[str, Any]:
        """Implementation task: returns a keyframe automation sequence that hugs the surface normal."""
        speed_profile = self._normalize_profile(speed_profile)
        lat = math.radians(start_lat_deg)
        lon = math.radians(start_lon_deg)
        heading = math.radians(start_heading_deg)
        frame_interval = 1000.0 / self.frame_rate
        step_count = max(1, math.ceil(run_duration_ms / frame_interval))
        keyframes: list[dict[str, Any]] = []

        for step in range(step_count):
            timestamp_ms = min(run_duration_ms, int(step * frame_interval))
            speed = self._speed_at(timestamp_ms, speed_profile)
            travel = (speed * frame_interval) / 1000.0
            angular = travel / self.planet_radius
            lat += angular * math.cos(heading)
            lon += angular * math.sin(heading) / max(0.1, math.cos(lat))
            lat = max(-math.pi / 2, min(math.pi / 2, lat))
            heading += 0.002 * math.sin(step / 8.0)
            position = self._spherical_to_cartesian(lat, lon)
            normal = _normalize(position)
            forward = self._tangent_direction(lat, lon, heading)
            keyframes.append(
                {
                    "timestamp_ms": timestamp_ms,
                    "position": {"x": position[0], "y": position[1], "z": position[2]},
                    "normal": {"x": normal[0], "y": normal[1], "z": normal[2]},
                    "forward": {"x": forward[0], "y": forward[1], "z": forward[2]},
                    "speed": round(speed, 3),
                    "heading_deg": math.degrees(heading) % 360,
                }
            )

        return {
            "keyframes": keyframes,
            "metadata": {
                "run_duration_ms": run_duration_ms,
                "frame_rate": self.frame_rate,
                "speed_profile": speed_profile,
            },
        }

    def _normalize_profile(self, profile: list[dict[str, float]] | None) -> list[dict[str, float]]:
        if not profile:
            return [{"time": 0.0, "speed": self.base_speed}]
        profile = sorted(profile, key=lambda entry: entry.get("time", 0.0))
        if profile[0]["time"] != 0.0:
            profile.insert(0, {"time": 0.0, "speed": self.base_speed})
        return profile

    def _speed_at(self, timestamp_ms: int, profile: list[dict[str, float]]) -> float:
        for index in range(len(profile) - 1):
            current = profile[index]
            nxt = profile[index + 1]
            if current["time"] <= timestamp_ms < nxt["time"]:
                return current["speed"]
        return profile[-1]["speed"]

    def _spherical_to_cartesian(self, lat: float, lon: float) -> tuple[float, float, float]:
        x = self.planet_radius * math.cos(lat) * math.cos(lon)
        y = self.planet_radius * math.cos(lat) * math.sin(lon)
        z = self.planet_radius * math.sin(lat)
        return x, y, z

    def _tangent_direction(self, lat: float, lon: float, heading: float) -> tuple[float, float, float]:
        east = (-math.sin(lon), math.cos(lon), 0.0)
        north = (
            -math.sin(lat) * math.cos(lon),
            -math.sin(lat) * math.sin(lon),
            math.cos(lat),
        )
        raw = (
            math.cos(heading) * north[0] + math.sin(heading) * east[0],
            math.cos(heading) * north[1] + math.sin(heading) * east[1],
            math.cos(heading) * north[2] + math.sin(heading) * east[2],
        )
        return _normalize(raw)

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
