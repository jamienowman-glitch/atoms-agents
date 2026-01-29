from __future__ import annotations

from dataclasses import dataclass
from typing import Any


@dataclass
class FrameDescriptor:
    """Per-frame metadata for planet surface rendering."""
    timestamp_ms: int
    media_uri: str
    lighting: dict[str, Any]
    curvature: dict[str, float]
    sample_chunk: list[float]


@dataclass
class RunnerKeyframe:
    """3D keyframe for planet runner automation."""
    timestamp_ms: int
    position: dict[str, float]  # {x, y, z}
    normal: dict[str, float]    # {x, y, z}
    forward: dict[str, float]   # {x, y, z}
    speed: float
    heading_deg: float


@dataclass
class PreviewPlan:
    """Complete preview plan for planet FPS experience."""
    strategy: str
    duration_ms: int
    resolution: dict[str, int]
    device_capability: str
    assets: dict[str, Any]
    timeline: dict[str, Any]
    actions: list[dict[str, Any]]
