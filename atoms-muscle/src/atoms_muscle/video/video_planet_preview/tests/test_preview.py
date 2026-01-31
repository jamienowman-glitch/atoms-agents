
import sys
import os
import pytest

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../..")))

from muscle.video.video_planet_preview.service import PlanetPreviewService

def test_preview_plan_structure():
    service = PlanetPreviewService()

    # Mock runner output
    run_metadata = {
        "run_duration_ms": 1000,
        "keyframes": [
            {
                "timestamp_ms": 0,
                "position": {"x": 100, "y": 0, "z": 0},
                "normal": {"x": 1, "y": 0, "z": 0},
                "forward": {"x": 0, "y": 1, "z": 0},
                "heading_deg": 0
            }
        ],
        "atlas_hash": "abc123hash"
    }

    result = service.create_preview_plan(
        run_metadata=run_metadata,
        strategy="webgl",
        surface_slug="test-planet"
    )

    plan = result["preview_plan"]
    assert plan["strategy"] == "webgl"
    assert plan["assets"]["surface_render"]["atlas_hash"] == "abc123hash"

    # Check timeline sync action token
    actions = plan["actions"]
    sync_action = next(a for a in actions if a["type"] == "timeline_sync")
    assert sync_action["target"] == "video_timeline"
    automations = sync_action["payload"]["automations"]

    # Check if automations were adapted correctly
    cam_x = next(a for a in automations if a["property"] == "camera_x")
    assert cam_x["keyframes"][0]["value"] == 100

    look_y = next(a for a in automations if a["property"] == "look_at_y")
    assert look_y["keyframes"][0]["value"] == 1

def test_preview_cpu_fallback():
    service = PlanetPreviewService()
    run_metadata = {"run_duration_ms": 1000}

    result = service.create_preview_plan(
        run_metadata=run_metadata,
        strategy="cpu-fallback"
    )

    plan = result["preview_plan"]
    assert plan["strategy"] == "cpu-fallback"
    assert "proxy_video" in plan["assets"]
    assert plan["assets"]["proxy_video"]["renderer"] == "video_render"
