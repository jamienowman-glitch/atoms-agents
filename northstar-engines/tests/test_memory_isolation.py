import asyncio
import pytest
from unittest.mock import MagicMock

from engines.common.identity import RequestContext
from engines.whiteboard_store.service import WhiteboardStoreService
from engines.blackboard_store.service import BlackboardStoreService
from engines.blackboard_store.service_reject import MissingBlackboardStoreRoute
from engines.realtime import timeline as timeline_module
from engines.realtime.run_stream import publish_run_event, stream_run_events, format_sse_event
from engines.realtime.timeline import InMemoryTimelineStore, set_timeline_store


@pytest.fixture
def context():
    return RequestContext(
        tenant_id="t_demo",
        mode="saas",
        project_id="project-1",
        user_id="user-1",
    )


def _setup_route(monkeypatch, backend_type="firestore"):
    mock_route = MagicMock()
    mock_route.backend_type = backend_type
    mock_route.config = {"project": "test"}
    registry = MagicMock()
    registry.get_route.return_value = mock_route
    monkeypatch.setattr("engines.whiteboard_store.service.routing_registry", lambda: registry)
    monkeypatch.setattr("engines.blackboard_store.service.routing_registry", lambda: registry)
    return registry


def _dummy_whiteboard_store():
    class DummyStore:
        def write(self, key, value, context, run_id, expected_version=None, edge_id=None):
            return {
                "key": key,
                "value": value,
                "version": 1,
                "created_by": context.user_id,
                "created_at": "ts",
                "updated_by": context.user_id,
                "updated_at": "ts",
                "modified_by_user_id": context.user_id,
                "modified_at": "ts",
            }
    return DummyStore()


def test_whiteboard_write_records_modified_metadata(monkeypatch, context):
    _setup_route(monkeypatch)
    monkeypatch.setattr(
        "engines.whiteboard_store.service.FirestoreWhiteboardStore",
        lambda project=None: _dummy_whiteboard_store(),
    )
    svc = WhiteboardStoreService(context)
    result = svc.write("k", {"foo": "bar"}, run_id="run-1", edge_id="edge-A")
    assert result["modified_by_user_id"] == context.user_id
    assert result["modified_at"] == "ts"


def test_whiteboard_requires_edge_id(monkeypatch, context):
    _setup_route(monkeypatch)
    monkeypatch.setattr(
        "engines.whiteboard_store.service.FirestoreWhiteboardStore",
        lambda project=None: _dummy_whiteboard_store(),
    )
    svc = WhiteboardStoreService(context)
    with pytest.raises(ValueError):
        svc.write("k", {"foo": "bar"}, run_id="run-1", edge_id="")


def test_blackboard_service_edge_aware(monkeypatch, context):
    _setup_route(monkeypatch)
    recorded = {}

    class DummyStore:
        def list_keys(self, ctx, run_id, edge_id=None):
            recorded["edge_id"] = edge_id
            return ["k1"]

    monkeypatch.setattr(
        "engines.blackboard_store.service.FirestoreBlackboardStore",
        lambda project=None: DummyStore(),
    )
    svc = BlackboardStoreService(context)
    keys = svc.list_keys("run-1", edge_id="edge-B")
    assert keys == ["k1"]
    assert recorded["edge_id"] == "edge-B"


def test_blackboard_service_rejects_missing_route(monkeypatch, context):
    registry = MagicMock()
    registry.get_route.return_value = None
    monkeypatch.setattr("engines.blackboard_store.service.routing_registry", lambda: registry)
    with pytest.raises(RuntimeError):
        BlackboardStoreService(context)


def test_run_stream_publish_and_stream(context):
    async def _run():
        store = InMemoryTimelineStore()
        set_timeline_store(store)
        timeline_module._timeline_service = None
        event = await publish_run_event(context, run_id="run-123", event_type="blackboard.write", data={"key": "k"})
        assert event.routing.tenant_id == context.tenant_id
        gen = stream_run_events("run-123", context, None)
        received = await gen.__anext__()
        assert received.event_id == event.event_id
        formatted = format_sse_event(received)
        assert "blackboard.write" in formatted
        await asyncio.sleep(0)

    asyncio.run(_run())
