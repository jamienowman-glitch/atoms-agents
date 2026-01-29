
import sys
import os
import pytest

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../..")))

from muscle.video.video_planet_surface_renderer.service import PlanetSurfaceRendererService

def test_surface_renderer_deterministic():
    service = PlanetSurfaceRendererService()
    params = {"radius": 3390.0, "glow_strength": 0.5, "slug": "test-planet"}

    # Run 1
    result1 = service.render(params, duration_ms=1000)

    # Run 2
    result2 = service.render(params, duration_ms=1000)

    assert result1["metadata"]["atlas_hash"] == result2["metadata"]["atlas_hash"]
    assert len(result1["frames"]) == len(result2["frames"])
    assert result1["frames"][0]["media_uri"] == result2["frames"][0]["media_uri"]

def test_surface_renderer_frames():
    service = PlanetSurfaceRendererService(base_frame_rate=10)
    params = {"radius": 100.0}
    result = service.render(params, duration_ms=1000)

    # Should have roughly 10 frames
    assert len(result["frames"]) == 10

    first_frame = result["frames"][0]
    assert "lighting" in first_frame
    assert "curvature" in first_frame
    assert "sample_chunk" in first_frame
    assert "timestamp_ms" in first_frame
