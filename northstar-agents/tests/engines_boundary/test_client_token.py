from unittest.mock import MagicMock
from northstar.engines_boundary.client import EnginesBoundaryClient


def test_get_token_catalog_url():
    client = EnginesBoundaryClient("http://test")
    client._request_httpx = MagicMock()

    ctx = MagicMock()

    # Test without element_id
    client.get_token_catalog("c1", ctx)
    client._request_httpx.assert_called_with("GET", "canvas/c1/token_catalog", ctx)

    # Test with element_id
    client.get_token_catalog("c1", ctx, element_id="e1")
    client._request_httpx.assert_called_with(
        "GET", "canvas/c1/token_catalog?element_id=e1", ctx
    )


def test_set_token_command():
    client = EnginesBoundaryClient("http://test")
    client.request_json = MagicMock()

    ctx = MagicMock()
    client.set_token("c1", "e1", "token.a", "val", 123, ctx)

    # Verify request_json called
    client.request_json.assert_called_once()
    args, kwargs = client.request_json.call_args
    assert args[0] == "POST"
    assert args[1] == "canvas/c1/commands"

    payload = kwargs["json"]
    assert payload["type"] == "set_token"
    assert payload["canvas_id"] == "c1"
    assert payload["base_rev"] == 123
    assert payload["args"] == {
        "element_id": "e1",
        "token_path": "token.a",
        "value": "val",
    }
