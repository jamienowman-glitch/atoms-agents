import pytest
from unittest.mock import MagicMock, patch
from src.northstar.clients.tokens import TokensClient
from src.northstar.clients.feeds import FeedsClient


@pytest.fixture
def mock_http():
    with patch("httpx.AsyncClient") as mock:
        yield mock


@pytest.mark.asyncio
async def test_tokens_client(mock_http):
    client = TokensClient(base_url="http://test")
    # Setup mock response
    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.raise_for_status = (
        MagicMock()
    )  # Regular mock, not async for raise_for_status usually unless httpx changed?
    # httpx.Response.json is a method, but the call to client.request is async.
    # The client method `request` is async.

    mock_response.json = MagicMock(return_value=[{"token_key": "test"}])

    mock_instance = mock_http.return_value.__aenter__.return_value
    mock_instance.request.return_value = mock_response

    # Test Get Catalog
    res = await client.get_token_catalog("c1")
    assert len(res) == 1
    assert res[0]["token_key"] == "test"

    # Verify URL construction
    mock_instance.request.assert_called_with(
        "GET",
        "http://test/canvas/c1/token_catalog",
        json=None,
        params=None,
        headers=client.headers,
        timeout=10.0,
    )


@pytest.mark.asyncio
async def test_feeds_client(mock_http):
    client = FeedsClient(base_url="http://test")
    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.raise_for_status = MagicMock()
    mock_response.json = MagicMock(return_value={"sources": []})

    mock_instance = mock_http.return_value.__aenter__.return_value
    mock_instance.request.return_value = mock_response

    await client.get_summary()

    mock_instance.request.assert_called_with(
        "GET",
        "http://test/feeds/summary",
        json=None,
        params=None,
        headers=client.headers,
        timeout=10.0,
    )
