import pytest
from fastapi import HTTPException
from engines.identity.routes_bootstrap import bootstrap
from engines.identity.models import User, Tenant, TenantMembership, Surface

# Mock the identity_repo
from unittest.mock import MagicMock, patch

@pytest.mark.asyncio
async def test_bootstrap_success():
    with patch("engines.identity.routes_bootstrap.identity_repo") as mock_repo:
        # Setup Data
        user = User(id="u_test", email="test@example.com")
        tenant = Tenant(id="t_test", name="Test Tenant")
        membership = TenantMembership(id="m_1", tenant_id="t_test", user_id="u_test", status="active")
        surface = Surface(id="s_console", tenant_id="t_test", name="Console", metadata={"theme": "blue"})

        # Setup Mocks
        mock_repo.get_user.return_value = user
        mock_repo.list_memberships_for_user.return_value = [membership]
        mock_repo.get_tenant.return_value = tenant
        mock_repo.list_surfaces_for_tenant.return_value = [surface]

        # Call
        response = await bootstrap(x_user_id="u_test")

        # Verify
        assert response["user"]["id"] == "u_test"
        assert response["tenant"]["id"] == "t_test"
        assert response["console"]["name"] == "Console"
        assert response["console"]["theme"] == "blue"

@pytest.mark.asyncio
async def test_bootstrap_fallback():
    with patch("engines.identity.routes_bootstrap.identity_repo") as mock_repo:
        # Setup Data (No specific surface)
        user = User(id="u_test", email="test@example.com")
        tenant = Tenant(id="t_test", name="Test Tenant")
        membership = TenantMembership(id="m_1", tenant_id="t_test", user_id="u_test", status="active")

        # Setup Mocks
        mock_repo.get_user.return_value = user
        mock_repo.list_memberships_for_user.return_value = [membership]
        mock_repo.get_tenant.return_value = tenant
        mock_repo.list_surfaces_for_tenant.return_value = [] # No surfaces

        # Call
        response = await bootstrap(x_user_id="u_test")

        # Verify Fallback
        assert response["console"]["name"] == "Northstar Console"
        assert response["console"]["id"] == "agnx_console_default"

@pytest.mark.asyncio
async def test_bootstrap_no_user():
    with patch("engines.identity.routes_bootstrap.identity_repo") as mock_repo:
        mock_repo.get_user.return_value = None

        with pytest.raises(HTTPException) as exc:
            await bootstrap(x_user_id="u_ghost")

        assert exc.value.status_code == 401
