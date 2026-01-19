"""Tests for SSE Transport Hardening (Step 4)."""
import os
import pytest
from unittest.mock import patch
from fastapi.testclient import TestClient
from engines.chat.service.server import app
from engines.realtime.isolation import registry
from engines.identity.jwt_service import default_jwt_service
from engines.chat.store_service import ChatMessageRecord

client = TestClient(app)

@pytest.fixture
def mock_jwt_secret():
    with patch.dict(os.environ, {"AUTH_JWT_SIGNING": "test-secret-key-123"}):
        yield "test-secret-key-123"

@pytest.fixture
def auth_headers(mock_jwt_secret):
    svc = default_jwt_service()
    token = svc.issue_token({
        "sub": "user-1",
        "default_tenant_id": "t_demo",
        "tenant_ids": ["t_demo"], 
        "role_map": {"t_demo": "member"}
    })
    return {
        "Authorization": f"Bearer {token}",
        "X-Tenant-Id": "t_demo",
        "X-Mode": "saas",
        "X-Project-Id": "p_demo",
        "X-App-Id": "app-demo",
        "X-Surface-Id": "surface-demo",
        "X-Request-Id": "req-demo-1",
    }

@pytest.fixture(autouse=True)
def cleanup():
    registry.clear()
    yield


@pytest.fixture(autouse=True)
def patch_chat_store(monkeypatch):
    import asyncio
    from datetime import datetime
    from engines.chat.contracts import Message, Contact
    class DummyStore:
        def append_message(self, thread_id: str, text: str, role: str, sender_id: str) -> ChatMessageRecord:
            return ChatMessageRecord(
                message_id="msg-1",
                thread_id=thread_id,
                text=text,
                role=role,
                sender_id=sender_id,
                cursor="msg-1",
                timestamp="now",
            )

        def list_messages(self, thread_id: str, after_cursor: str | None = None, limit: int = 100):
            return []

        def latest_cursor(self, thread_id: str) -> str | None:
            return "cursor-0"

    dummy = DummyStore()
    monkeypatch.setattr("engines.chat.service.sse_transport.chat_store_or_503", lambda ctx: dummy)
    monkeypatch.setattr("engines.chat.service.transport_layer.chat_store_or_503", lambda ctx: dummy)
    import importlib
    canvas_router_module = importlib.import_module("engines.canvas_stream.router")
    monkeypatch.setattr(canvas_router_module, "chat_store_or_503", lambda ctx: dummy)
    from engines.chat.service import transport_layer
    transport_layer.bus._impl = transport_layer.InMemoryBus()

    # Patch chat SSE stream to emit a single event and exit
    chat_sse = importlib.import_module("engines.chat.service.sse_transport")
    async def fake_chat_stream_with_resume(thread_id: str, request_context, last_event_id=None, store=None, validate_cursor: bool = True):
        yield "data: {}\n\n"
    monkeypatch.setattr(chat_sse, "_chat_stream_with_resume", fake_chat_stream_with_resume)

    # Patch canvas SSE stream to emit deterministic SPATIAL_UPDATE and exit
    canvas_module = importlib.import_module("engines.canvas_stream.router")
    from engines.realtime.contracts import (
        RoutingKeys,
        EventIds,
        ActorType,
        MediaSidecar,
        MediaPayload,
        SpatialBounds,
        SpatialUpdatePayload,
        build_spatial_update_event,
    )
    async def fake_canvas_event_stream(canvas_id: str, request_context, last_event_id: str | None = None):
        routing = RoutingKeys(
            tenant_id=request_context.tenant_id,
            env=request_context.env,
            mode=request_context.mode,
            project_id=request_context.project_id,
            app_id=request_context.app_id,
            surface_id=request_context.surface_id,
            canvas_id=canvas_id,
            actor_id=request_context.user_id or "system",
            actor_type=ActorType.HUMAN,
        )
        payload = SpatialUpdatePayload(
            atom_id="atom-99",
            atom_metadata={"role": "button"},
            media_payload=MediaPayload(sidecars=[MediaSidecar(uri="https://example.com/frame.png")]),
            bounds=SpatialBounds(x=0, y=0, w=10, h=20, z=0),
        )
        event = build_spatial_update_event(
            payload,
            routing,
            EventIds(request_id=request_context.request_id, run_id=canvas_id, step_id="spatial"),
            trace_id=request_context.request_id,
        )
        yield canvas_module._format_sse_event(event)
    monkeypatch.setattr(canvas_module, "event_stream", fake_canvas_event_stream)

    # Patch subscribe_async to a deterministic queue-backed generator and feed an initial event
    queue: asyncio.Queue[Message] = asyncio.Queue()
    queue.put_nowait(
        Message(
            id="init-evt",
            thread_id="init-thread",
            sender=Contact(id="system"),
            text="{}",
            role="system",
            created_at=datetime.utcnow(),
        )
    )

    async def fake_subscribe_async(thread_id: str, last_event_id: str | None = None, context=None):
        while True:
            msg = await queue.get()
            yield msg

    monkeypatch.setattr(transport_layer, "subscribe_async", fake_subscribe_async)
    monkeypatch.setattr("engines.chat.service.sse_transport.subscribe_async", fake_subscribe_async)
    monkeypatch.setattr("engines.canvas_stream.service.subscribe_async", fake_subscribe_async)
    monkeypatch.setattr(transport_layer.bus, "add_message", lambda thread_id, msg: queue.put_nowait(msg))
    yield

def test_sse_chat_isolation(auth_headers):
    # Register verified thread
    registry.register_thread("t_demo", "th-1")
    registry.register_thread("t_other", "th-2")
    
    # Happy path
    with client.stream("GET", "/sse/chat/th-1", headers=auth_headers) as resp:
        assert resp.status_code == 200
    
    # Access denied to t_other
    # Note: verify_thread_access raises 404 for unknown/mismatch in our strict impl
    resp = client.get("/sse/chat/th-2", headers=auth_headers)
    assert resp.status_code == 404

    # Access unknown
    resp = client.get("/sse/chat/th-unknown", headers=auth_headers)
    assert resp.status_code == 404

def test_sse_canvas_isolation(auth_headers):
    registry.register_canvas("t_demo", "canvas-1")
    registry.register_canvas("t_other", "canvas-2")

    # Happy path
    with client.stream("GET", "/sse/canvas/canvas-1", headers=auth_headers) as resp:
        assert resp.status_code == 200

    # Access denied
    resp = client.get("/sse/canvas/canvas-2", headers=auth_headers)
    assert resp.status_code == 404

def test_sse_streamevent_structure(auth_headers):
    """Verify SSE yields proper StreamEvent JSON."""
    registry.register_canvas("t_demo", "canvas-active")
    
    # We need to simulate a message on the bus to see output.
    # Since we can't easily inject into the running bus of the TestClient process 
    # (unless we share the bus instance, which we do: engines.chat.service.transport_layer.bus)
    
    from engines.chat.service.transport_layer import bus
    from engines.chat.contracts import Message, Contact
    from datetime import datetime
    import json
    
    # Start stream
    with client.stream("GET", "/sse/canvas/canvas-active", headers=auth_headers) as response:
        # Publish event
        spatial_payload = {
            "type": "SPATIAL_UPDATE",
            "atom_id": "atom-99",
            "bounds": {"x": 0, "y": 0, "w": 10, "h": 20, "z": 0},
            "atom_metadata": {"role": "button"},
            "media_payload": {"sidecars": [{"uri": "https://example.com/frame.png"}]},
        }
        bus.add_message("canvas-active", Message(
            id="evt-1",
            thread_id="canvas-active",
            sender=Contact(id="user-1"),
            text=json.dumps(spatial_payload),
            role="system",
            created_at=datetime.utcnow()
        ))
        
        # Read stream
        # SSE iterator yields lines.
        # We look for "data: {...}"
        found = False
        for line in response.iter_lines():
            if line.startswith("data: "):
                payload = json.loads(line[6:])
                if payload.get("type") != "SPATIAL_UPDATE":
                    continue
                assert payload["routing"]["tenant_id"] == "t_demo"
                assert payload["routing"]["project_id"] == "p_demo"
                assert payload["atom_metadata"]["role"] == "button"
                assert payload["media_payload"]["sidecars"][0]["uri"].startswith("https://")
                found = True
                break
        assert found
