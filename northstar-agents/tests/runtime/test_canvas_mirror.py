import asyncio
import base64
import json

import httpx
from pathlib import Path

from northstar.runtime.canvas_mirror import CanvasMirror
from northstar.runtime.context import AgentsRequestContext, ContextMode


def test_canvas_mirror_collects_sse_events():
    async def run_test():
        seen_headers = {}

        async def handler(request: httpx.Request) -> httpx.Response:
            seen_headers.update(request.headers)

            payload = {
                "event_id": "evt-1",
                "type": "SPATIAL_UPDATE",
                "atom_metadata": {"color": "green"},
            }
            content = f"data: {json.dumps(payload)}\n\n".encode("utf-8")
            return httpx.Response(
                200,
                headers={"Content-Type": "text/event-stream"},
                content=content,
            )

        transport = httpx.MockTransport(handler)
        ctx = AgentsRequestContext(
            tenant_id="t_demo",
            mode=ContextMode.SAAS,
            project_id="p_demo",
            request_id="req-1",
            surface_id="canvas-1",
            app_id="app-demo",
        )

        mirror = CanvasMirror(
            "http://engines.local",
            ctx,
            canvas_id="canvas-1",
            transport=transport,
            capacity=10,
        )

        await mirror.start()
        await mirror.wait()
        return mirror, seen_headers

    mirror, seen_headers = asyncio.run(run_test())

    assert mirror.last_event_id == "evt-1"
    events = mirror.snapshot()
    assert events[0]["type"] == "SPATIAL_UPDATE"
    assert events[0]["atom_metadata"]["color"] == "green"
    assert seen_headers.get("X-Project-Id") == mirror.ctx.project_id or seen_headers.get("x-project-id") == mirror.ctx.project_id


def test_canvas_mirror_sanitizes_visual_sidecars(tmp_path, monkeypatch):
    async def run_test():
        monkeypatch.setattr(
            "northstar.runtime.visual_sidecar.get_artifacts_dir",
            lambda: tmp_path,
        )

        data_uri = f"data:image/png;base64,{base64.b64encode(b'fake').decode()}"

        async def handler(request: httpx.Request) -> httpx.Response:
            payload = {
                "event_id": "evt-visual",
                "type": "VISUAL_SNAPSHOT",
                "data": {
                    "type": "VISUAL_SNAPSHOT",
                    "data": {"image": data_uri},
                },
            }
            content = f"data: {json.dumps(payload)}\n\n".encode("utf-8")
            return httpx.Response(
                200,
                headers={"Content-Type": "text/event-stream"},
                content=content,
            )

        transport = httpx.MockTransport(handler)
        ctx = AgentsRequestContext(
            tenant_id="t_demo",
            mode=ContextMode.SAAS,
            project_id="p_demo",
            request_id="req-2",
            surface_id="canvas-2",
        )

        mirror = CanvasMirror(
            "http://engines.local",
            ctx,
            canvas_id="canvas-2",
            transport=transport,
            capacity=10,
        )

        await mirror.start()
        await mirror.wait()
        return mirror

    mirror = asyncio.run(run_test())
    events = mirror.snapshot()
    assert events
    image_value = events[0]["data"]["data"]["image"]
    assert isinstance(image_value, dict)
    assert image_value["uri"].startswith("file://")
    assert Path(image_value["uri"][7:]).exists()
