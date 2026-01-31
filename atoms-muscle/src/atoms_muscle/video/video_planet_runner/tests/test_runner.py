
import math
import sys
import os
import pytest

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../..")))

from muscle.video.video_planet_runner.service import PlanetRunnerService

def test_runner_deterministic():
    service = PlanetRunnerService()

    # Run 1
    result1 = service.simulate_run(run_duration_ms=1000)

    # Run 2
    result2 = service.simulate_run(run_duration_ms=1000)

    assert len(result1["keyframes"]) == len(result2["keyframes"])
    assert result1["keyframes"][0]["position"] == result2["keyframes"][0]["position"]

def test_runner_normalization():
    radius = 100.0
    service = PlanetRunnerService(planet_radius=radius)
    result = service.simulate_run(run_duration_ms=1000)

    for frame in result["keyframes"]:
        pos = frame["position"]
        # Check distance from center approx equals radius
        dist = math.sqrt(pos["x"]**2 + pos["y"]**2 + pos["z"]**2)
        assert math.isclose(dist, radius, rel_tol=1e-3)

        # Check normal points away from center (same direction as position)
        norm = frame["normal"]
        norm_len = math.sqrt(norm["x"]**2 + norm["y"]**2 + norm["z"]**2)
        assert math.isclose(norm_len, 1.0, rel_tol=1e-3)

        # Dot product of normalized pos and normal should be close to 1
        pos_norm = (pos["x"]/dist, pos["y"]/dist, pos["z"]/dist)
        dot = pos_norm[0]*norm["x"] + pos_norm[1]*norm["y"] + pos_norm[2]*norm["z"]
        assert math.isclose(dot, 1.0, rel_tol=1e-3)

def test_run_plan_alias():
    service = PlanetRunnerService()
    result = service.run_plan(duration_ms=500)
    assert len(result["keyframes"]) > 0
