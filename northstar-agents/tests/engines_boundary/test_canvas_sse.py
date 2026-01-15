import pytest
from unittest.mock import MagicMock, patch
from northstar.engines_boundary.client import EnginesBoundaryClient
from northstar.engines_boundary.errors import PermissionDenied, TransportError
from northstar.runtime.context import AgentsRequestContext, ContextMode
import httpx


def test_subscribe_canvas_sse_parsing():
    client = EnginesBoundaryClient("http://test.url")
    ctx = AgentsRequestContext(
        tenant_id="t1",
        mode=ContextMode.LAB,
        project_id="p1",
        request_id="r1",
        user_id="user",
    )

    mock_lines = [
        "event: canvas_commit",
        'data: {"rev": "r1"}',
        "id: 1",
        "",
        "event: other",
        'data: {"rev": "r2"}',
        "id: 2",
        "",
    ]

    with patch("httpx.stream") as mock_stream:
        mock_resp = MagicMock()
        mock_resp.__enter__.return_value = mock_resp
        mock_resp.__exit__.return_value = None
        mock_resp.status_code = 200
        mock_resp.iter_lines.return_value = mock_lines
        mock_stream.return_value = mock_resp

        events = list(client.subscribe_canvas_sse("c1", ctx))

        assert len(events) == 2
        assert events[0] == {"event": "canvas_commit", "data": {"rev": "r1"}, "id": "1"}
        assert events[1] == {"event": "other", "data": {"rev": "r2"}, "id": "2"}

        # Check Last-Event-ID not sent
        call_kwargs = mock_stream.call_args[1]
        assert "Last-Event-ID" not in call_kwargs["headers"]


def test_subscribe_canvas_sse_last_event_id():
    client = EnginesBoundaryClient("http://test.url")
    ctx = AgentsRequestContext(
        tenant_id="t1",
        mode=ContextMode.LAB,
        project_id="p1",
        request_id="r1",
        user_id="user",
    )

    with patch("httpx.stream") as mock_stream:
        mock_resp = MagicMock()
        mock_resp.__enter__.return_value = mock_resp
        mock_resp.__exit__.return_value = None
        mock_resp.status_code = 200
        mock_resp.iter_lines.return_value = []
        mock_stream.return_value = mock_resp

        list(client.subscribe_canvas_sse("c1", ctx, last_event_id="100"))

        call_kwargs = mock_stream.call_args[1]
        assert call_kwargs["headers"]["Last-Event-ID"] == "100"


def test_subscribe_canvas_sse_permission_denied():
    client = EnginesBoundaryClient("http://test.url")
    ctx = AgentsRequestContext(
        tenant_id="t1",
        mode=ContextMode.LAB,
        project_id="p1",
        request_id="r1",
        user_id="user",
    )

    with patch("httpx.stream") as mock_stream:
        mock_resp = MagicMock()
        mock_resp.__enter__.return_value = mock_resp
        mock_resp.__exit__.return_value = None
        mock_resp.status_code = 403
        mock_resp.json.return_value = {"error": "forbidden"}
        mock_stream.return_value = mock_resp

        with pytest.raises(PermissionDenied):
            list(client.subscribe_canvas_sse("c1", ctx))


def test_subscribe_canvas_sse_transport_error():
    client = EnginesBoundaryClient("http://test.url")
    ctx = AgentsRequestContext(
        tenant_id="t1",
        mode=ContextMode.LAB,
        project_id="p1",
        request_id="r1",
        user_id="user",
    )

    with patch("httpx.stream", side_effect=httpx.RequestError("fail")):
        with pytest.raises(TransportError):
            list(client.subscribe_canvas_sse("c1", ctx))
