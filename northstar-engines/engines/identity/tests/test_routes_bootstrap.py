import pytest
from fastapi.testclient import TestClient
from engines.identity.routes_bootstrap import router
from engines.identity.repository import InMemoryIdentityRepository
from engines.identity.state import set_identity_repo
from engines.identity.models import User, Tenant, TenantMembership
from fastapi import FastAPI

# Setup test app
app = FastAPI()
app.include_router(router)
client = TestClient(app)

@pytest.fixture(autouse=True)
def reset_repo():
    repo = InMemoryIdentityRepository()
    set_identity_repo(repo)
    return repo

def test_bootstrap_success(reset_repo):
    repo = reset_repo
    # Setup Data
    user = User(id="u1", email="test@example.com")
    repo.create_user(user)

    tenant = Tenant(id="t1", name="Test Tenant")
    repo.create_tenant(tenant)

    membership = TenantMembership(tenant_id="t1", user_id="u1", role="owner", status="active")
    repo.create_membership(membership)

    response = client.get(
        "/bootstrap",
        headers={"X-User-ID": "u1"}
    )

    assert response.status_code == 200
    data = response.json()
    assert data["user"]["id"] == "u1"
    assert data["tenant"]["id"] == "t1"
    assert data["console"]["theme"] == "dark"

def test_bootstrap_user_not_found():
    response = client.get(
        "/bootstrap",
        headers={"X-User-ID": "u_unknown"}
    )
    assert response.status_code == 401

def test_bootstrap_no_header():
    response = client.get("/bootstrap")
    assert response.status_code == 401

def test_bootstrap_no_membership(reset_repo):
    repo = reset_repo
    user = User(id="u2", email="orphan@example.com")
    repo.create_user(user)

    response = client.get(
        "/bootstrap",
        headers={"X-User-ID": "u2"}
    )
    assert response.status_code == 403
