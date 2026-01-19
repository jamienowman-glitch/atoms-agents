"""Tests for Canonical Realtime Contracts."""
import pytest
from datetime import datetime
from engines.realtime.contracts import (
    StreamEvent,
    RoutingKeys,
    EventIds,
    ActorType,
    MediaPayload,
    MediaSidecar,
    SpatialBounds,
    SpatialUpdatePayload,
    build_atom_metadata_event,
    build_spatial_update_event,
    from_legacy_message,
)
from engines.chat.contracts import Message, Contact, ChatScope

def test_stream_event_minimal():
    """Verify minimal valid StreamEvent."""
    routing = RoutingKeys(
        tenant_id="t_demo",
        env="dev",
        project_id="p_demo",
        actor_id="user-123",
        actor_type=ActorType.HUMAN
    )
    event = StreamEvent(
        type="test_ping",
        routing=routing,
        data={"foo": "bar"}
    )
    assert event.v == 1
    assert event.type == "test_ping"
    assert event.routing.tenant_id == "t_demo"
    assert event.event_id is not None
    assert event.ts is not None

def test_routing_validation():
    """Verify routing key validation patterns."""
    # Invalid tenant format
    with pytest.raises(ValueError):
        RoutingKeys(
            tenant_id="bad-tenant", # Missing t_
            env="dev",
            project_id="p_demo",
            actor_id="u1",
            actor_type=ActorType.HUMAN
        )
    
    # Valid
    rk = RoutingKeys(
        tenant_id="t_valid_1",
        env="prod",
        project_id="p_demo",
        actor_id="u1",
        actor_type=ActorType.HUMAN
    )
    assert rk.tenant_id == "t_valid_1"

def test_legacy_message_conversion():
    """Verify from_legacy_message adapter."""
    msg = Message(
        id="msg-1",
        thread_id="th-1",
        sender=Contact(id="u-legacy"),
        text="Hello World",
        role="user",
        scope=ChatScope(app="app-1")
    )
    
    event = from_legacy_message(
        msg,
        tenant_id="t_legacy",
        env="dev",
        project_id="p_legacy",
        request_id="req-1",
    )
    
    assert event.type == "user_message"
    assert event.routing.tenant_id == "t_legacy"
    assert event.routing.thread_id == "th-1"
    assert event.routing.app_id == "app-1"
    assert event.ids.request_id == "req-1"
    assert event.data["text"] == "Hello World"
    assert event.meta.last_event_id == event.event_id


def test_legacy_message_trace_id():
    msg = Message(
        id="msg-3",
        thread_id="th-3",
        sender=Contact(id="u-legacy"),
        text="Trace me",
        role="user"
    )

    event = from_legacy_message(
        msg,
        tenant_id="t_legacy",
        env="dev",
        project_id="p_legacy",
        trace_id="trace-007"
    )

    assert event.trace_id == "trace-007"

def test_legacy_json_unwrapping():
    """Verify checking for structured JSON inside legacy text."""
    import json
    inner = {
        "type": "token_chunk",
        "data": {"delta": "Hi"},
        "request_id": "req-internal"
    }
    msg = Message(
        id="msg-2",
        thread_id="th-2",
        sender=Contact(id="agent-1"),
        text=json.dumps(inner),
        role="agent"
    )
    
    event = from_legacy_message(
        msg,
        tenant_id="t_legacy",
        env="dev",
        project_id="p_legacy",
    )
    
    assert event.type == "token_chunk"
    assert event.ids.request_id == "req-internal"
    assert event.data["delta"] == "Hi"


def test_media_payload_rejects_data_uri():
    with pytest.raises(ValueError):
        MediaSidecar(uri="data:image/png;base64,abcd", object_id=None, artifact_id=None)

    payload = MediaPayload(
        sidecars=[MediaSidecar(uri="https://example.com/image.png")],
        caption="safe",
    )
    assert payload.sidecars[0].uri.endswith("image.png")


def test_spatial_update_payload_round_trip():
    payload = SpatialUpdatePayload(
        atom_id="atom-1",
        atom_metadata={"color": "red"},
        bounds=SpatialBounds(x=1, y=2, w=100, h=200, z=0),
    )
    data = payload.model_dump()
    assert data["bounds"]["w"] == 100
    assert "atom_metadata" in data


def test_build_spatial_update_event_sets_slots():
    payload = SpatialUpdatePayload(
        atom_id="atom-2",
        atom_metadata={"color": "blue"},
        media_payload=MediaPayload(
            sidecars=[MediaSidecar(uri="https://example.com/blob.png")],
        ),
        bounds=SpatialBounds(x=0, y=0, w=10, h=20, z=0),
    )
    routing = RoutingKeys(
        tenant_id="t_demo",
        env="dev",
        project_id="p_demo",
        actor_id="actor",
        actor_type=ActorType.HUMAN,
    )
    ids = EventIds(request_id="req-1", run_id="run-1", step_id="spatial")
    event = build_spatial_update_event(
        payload,
        routing,
        ids,
        trace_id="trace-1",
        event_id="evt-123",
    )
    assert event.type == "SPATIAL_UPDATE"
    assert event.atom_metadata["color"] == "blue"
    assert event.media_payload is not None
    assert event.media_payload.sidecars[0].uri.startswith("https://")
    assert event.ids.run_id == "run-1"
