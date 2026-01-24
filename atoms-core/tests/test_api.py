from fastapi.testclient import TestClient
from src.core.main import app
from src.core.identity.constants import SYSTEM_KEY_HEADER
from unittest.mock import MagicMock, patch
import os

# Ensure env vars are loaded as expected for tests
# (TestClient usually picks up the app state, but env vars should be set before app init or mocked)
# Since we have a .env file, pydantic settings should have loaded "test_system_key"

client = TestClient(app)

def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

def test_bootstrap_system_key():
    # Assuming .env has SYSTEM_KEY=test_system_key
    headers = {SYSTEM_KEY_HEADER: "test_system_key"}
    response = client.get("/api/v1/bootstrap", headers=headers)
    assert response.status_code == 200, f"Response: {response.text}"
    data = response.json()
    assert data["user"] == "system"
    assert data["role"] == "owner"
    assert data["tenant"] == "t_system"

def test_bootstrap_unauthorized():
    response = client.get("/api/v1/bootstrap")
    assert response.status_code == 401

@patch("src.core.identity.middleware.supabase")
def test_bootstrap_bearer_token(mock_supabase):
    # Setup Mock User Response
    mock_response = MagicMock()
    mock_response.user.id = "u_test_user"

    # Configure the mock client's auth.get_user method
    mock_supabase.auth.get_user.return_value = mock_response

    headers = {"Authorization": "Bearer valid_token"}
    response = client.get("/api/v1/bootstrap", headers=headers)

    assert response.status_code == 200, f"Response: {response.text}"
    data = response.json()
    assert data["user"] == "u_test_user"
    # Expect default stub since no X-Tenant-ID provided
    assert data["tenant"] == "t_demo_workspace"

@patch("src.core.identity.middleware.supabase")
def test_bootstrap_bearer_token_with_tenant(mock_supabase):
    # Setup Mock
    mock_response = MagicMock()
    mock_response.user.id = "u_test_user_2"
    mock_supabase.auth.get_user.return_value = mock_response

    headers = {
        "Authorization": "Bearer valid_token",
        "X-Tenant-ID": "t_custom_tenant"
    }
    response = client.get("/api/v1/bootstrap", headers=headers)

    assert response.status_code == 200
    data = response.json()
    assert data["user"] == "u_test_user_2"
    assert data["tenant"] == "t_custom_tenant"
