import sys
from unittest.mock import MagicMock, patch, AsyncMock
from fastapi import APIRouter
import pytest

# 0. Mock Heavy Dependencies (ML/DB libs) to avoid install
sys.modules["lancedb"] = MagicMock()
sys.modules["pyarrow"] = MagicMock()
sys.modules["mistralai"] = MagicMock()
sys.modules["mistralai.client"] = MagicMock()
sys.modules["open_clip"] = MagicMock() # open_clip_torch
sys.modules["umap"] = MagicMock()
sys.modules["umap.umap_"] = MagicMock()
sys.modules["torch"] = MagicMock()
sys.modules["torchvision"] = MagicMock()
sys.modules["PIL"] = MagicMock()
sys.modules["faster_whisper"] = MagicMock()
sys.modules["ffmpeg"] = MagicMock()
sys.modules["boto3"] = MagicMock()
sys.modules["botocore"] = MagicMock()
sys.modules["botocore.exceptions"] = MagicMock()
sys.modules["google"] = MagicMock()
sys.modules["google.auth"] = MagicMock()
sys.modules["google.cloud"] = MagicMock()
sys.modules["google.cloud.bigquery"] = MagicMock()
sys.modules["numpy"] = MagicMock()

# 0.1 Mock internal routers to avoid loading broken/heavy dependencies
mock_router_mod = MagicMock()
mock_router_mod.router = APIRouter()

sys.modules["src.nexus.routes"] = mock_router_mod
sys.modules["src.vault.routes"] = mock_router_mod
sys.modules["src.budget.routes"] = mock_router_mod
sys.modules["src.realtime.sse"] = mock_router_mod
sys.modules["src.realtime.ws"] = mock_router_mod


# 1. Patch Settings BEFORE importing app
mock_settings = MagicMock()
mock_settings.SUPABASE_URL = "http://mock"
mock_settings.SUPABASE_ANON_KEY = "mock"
mock_settings.SYSTEM_KEY = "mock"
mock_settings.GSM_CONNECTED = False

# Start patcher
config_patcher = patch("src.config.get_settings", return_value=mock_settings)
config_patcher.start()

# 2. Now safe to import app
from fastapi.testclient import TestClient
from src.main import app

client = TestClient(app)

@patch("src.maybes.service.supabase")
@patch("src.identity.middleware.supabase")
def test_create_note(mock_middleware_supabase, mock_service_supabase):
    # Setup Auth Mock
    mock_user_resp = MagicMock()
    mock_user_resp.user.id = "u_test"
    mock_middleware_supabase.auth.get_user.return_value = mock_user_resp

    # Setup Service DB Mock
    mock_table = MagicMock()
    mock_service_supabase.table.return_value = mock_table

    # Mock Insert Return
    mock_table.insert.return_value.execute.return_value.data = [{
        "id": "123e4567-e89b-12d3-a456-426614174000",
        "tenant_id": "t_demo_workspace",
        "user_id": "u_test",
        "type": "text",
        "content_text": "Hello World",
        "content_meta": {},
        "position": {"x": 10.0, "y": 20.0},
        "zoom": 1.0,
        "is_archived": False,
        "created_at": "2023-01-01T00:00:00Z",
        "updated_at": "2023-01-01T00:00:00Z"
    }]

    headers = {"Authorization": "Bearer token", "X-Tenant-ID": "t_demo_workspace"}
    response = client.post("/api/v1/maybes/notes", json={"type": "text", "content_text": "Hello World"}, headers=headers)

    assert response.status_code == 200, f"Response: {response.text}"
    data = response.json()
    assert data["content_text"] == "Hello World"
    assert data["tenant_id"] == "t_demo_workspace"

@patch("src.maybes.service.supabase")
@patch("src.identity.middleware.supabase")
def test_list_notes_tenant_isolation(mock_middleware_supabase, mock_service_supabase):
    # Setup Auth
    mock_user_resp = MagicMock()
    mock_user_resp.user.id = "u_test"
    mock_middleware_supabase.auth.get_user.return_value = mock_user_resp

    # Setup DB
    mock_table = MagicMock()
    mock_service_supabase.table.return_value = mock_table

    # Mock Select
    mock_table.select.return_value.eq.return_value.order.return_value.execute.return_value.data = []

    headers = {"Authorization": "Bearer token"}
    # We can inject X-Tenant-ID to simulate specific tenant
    headers["X-Tenant-ID"] = "t_special"

    client.get("/api/v1/maybes/notes", headers=headers)

    # Verify tenant_id was used in query
    mock_table.select.assert_called_with("*")
    select_return = mock_table.select.return_value
    select_return.eq.assert_called_with("tenant_id", "t_special")

@patch("src.maybes.service.get_timeline_service")
@patch("src.maybes.service.supabase")
@patch("src.identity.middleware.supabase")
def test_forward_note(mock_middleware_supabase, mock_service_supabase, mock_get_timeline):
    # Setup Auth
    mock_user_resp = MagicMock()
    mock_user_resp.user.id = "u_test"
    mock_middleware_supabase.auth.get_user.return_value = mock_user_resp

    # Setup DB (Fetch note)
    mock_table = MagicMock()
    mock_service_supabase.table.return_value = mock_table

    mock_table.select.return_value.eq.return_value.eq.return_value.execute.return_value.data = [{
        "id": "123e4567-e89b-12d3-a456-426614174000",
        "tenant_id": "t_demo_workspace",
        "user_id": "u_test",
        "type": "text",
        "content_text": "Forward Me",
        "content_meta": {},
        "position": {"x": 0.0, "y": 0.0},
        "zoom": 1.0,
        "is_archived": False,
        "created_at": "2023-01-01T00:00:00Z",
        "updated_at": "2023-01-01T00:00:00Z"
    }]

    # Setup Timeline Mock
    mock_timeline = AsyncMock()
    mock_get_timeline.return_value = mock_timeline

    headers = {"Authorization": "Bearer token", "X-Tenant-ID": "t_demo_workspace"}
    response = client.post(
        "/api/v1/maybes/forward",
        params={"note_id": "123e4567-e89b-12d3-a456-426614174000", "target_surface": "surface_b"},
        headers=headers
    )

    assert response.status_code == 200, f"Response: {response.text}"
    assert mock_timeline.append_event.called
    args, _ = mock_timeline.append_event.call_args
    event = args[0]
    assert event.type == "maybes.forward"
    assert event.data["content"] == "Forward Me"
    assert event.routing.surface_id == "surface_b"
    assert event.routing.tenant_id == "t_demo_workspace"
