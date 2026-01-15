from unittest.mock import MagicMock, patch
from northstar.engines_boundary.client import EnginesBoundaryClient
from northstar.runtime.context import AgentsRequestContext, ContextMode


def test_list_registry_domain():
    client = EnginesBoundaryClient("http://test.url")
    ctx = AgentsRequestContext(
        tenant_id="t1",
        mode=ContextMode.LAB,
        project_id="p1",
        request_id="r1",
        user_id="user",
    )

    with patch("httpx.request") as mock_req:
        mock_resp = MagicMock()
        mock_resp.is_error = False
        mock_resp.json.return_value = {"items": []}
        mock_resp.content = b'{"items": []}'
        mock_req.return_value = mock_resp

        result = client.list_registry_domain("graphlenses", ctx)

        assert result == {"items": []}
        expected_headers = {
            "X-Tenant-Id": "t1",
            "X-Mode": "lab",
            "X-Project-Id": "p1",
            "X-Request-Id": "r1",
            "X-User-Id": "user",
            "Accept": "application/json",
            "Content-Type": "application/json",
        }
        mock_req.assert_called_with(
            "GET",
            "http://test.url/registry/graphlenses",
            headers=expected_headers,
            json=None,
        )


def test_get_registry_entry():
    client = EnginesBoundaryClient("http://test.url")
    ctx = AgentsRequestContext(
        tenant_id="t1",
        mode=ContextMode.LAB,
        project_id="p1",
        request_id="r1",
        user_id="user",
    )

    with patch("httpx.request") as mock_req:
        mock_resp = MagicMock()
        mock_resp.is_error = False
        mock_resp.json.return_value = {"id": "123"}
        mock_resp.content = b'{"id": "123"}'
        mock_req.return_value = mock_resp

        result = client.get_registry_entry("canvases", "123", ctx)

        assert result == {"id": "123"}
        expected_headers = {
            "X-Tenant-Id": "t1",
            "X-Mode": "lab",
            "X-Project-Id": "p1",
            "X-Request-Id": "r1",
            "X-User-Id": "user",
            "Accept": "application/json",
            "Content-Type": "application/json",
        }
        mock_req.assert_called_with(
            "GET",
            "http://test.url/registry/canvases/123",
            headers=expected_headers,
            json=None,
        )
