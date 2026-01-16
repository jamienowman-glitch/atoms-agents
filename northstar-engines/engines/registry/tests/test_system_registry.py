from __future__ import annotations

from typing import Any, Dict

import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient

from engines.chat.service.http_transport import register_error_handlers
from engines.common.identity import RequestContext
from engines.identity.jwt_service import AuthContext
from engines.registry.routes import router
from engines.registry.service import (
    SystemRegistryService,
    set_system_registry_service,
)
from engines.identity.jwt_service import default_jwt_service


@pytest.fixture
def context() -> RequestContext:
    ctx = RequestContext(
        tenant_id="t_system", # Use t_system to allow seeding
        env="dev",
        mode="saas",
        project_id="proj",
        request_id="req-1",
        user_id="user1",
    )
    ctx.surface_id = "surface-registry"
    return ctx


@pytest.fixture
def valid_token(monkeypatch) -> str:
    monkeypatch.setenv("AUTH_JWT_SIGNING", "test-secret")
    service = default_jwt_service()
    return service.issue_token({
        "sub": "user1",
        "email": "test@example.com",
        "tenant_ids": ["t_system"],
        "default_tenant_id": "t_system",
        "role_map": {"t_system": "owner"},
    })


@pytest.fixture
def registry_headers(valid_token: str) -> Dict[str, str]:
    return {
        "X-Tenant-Id": "t_system",
        "X-Mode": "saas",
        "X-Project-Id": "proj",
        "X-Surface-Id": "surface-registry",
        "X-App-Id": "app-registry",
        "Authorization": f"Bearer {valid_token}",
    }


@pytest.fixture
def fake_tabular(monkeypatch):
    class FakeTabularStoreService:
        _store: Dict[str, Dict[str, Dict[str, Any]]] = {}

        def __init__(self, context, resource_kind="component_registry"):
            self.context = context
            self.resource_kind = resource_kind

        def upsert(self, table_name: str, key: str, data: Dict[str, Any], context):
            table = FakeTabularStoreService._store.setdefault(table_name, {})
            table[key] = data

        def get(self, table_name: str, key: str, context):
            return FakeTabularStoreService._store.get(table_name, {}).get(key)

        def list_by_prefix(self, table_name: str, prefix: str, context):
            table = FakeTabularStoreService._store.get(table_name, {})
            return [
                value
                for stored_key, value in table.items()
                if stored_key.startswith(prefix)
            ]

        def delete(self, table_name: str, key: str):
            table = FakeTabularStoreService._store.get(table_name, {})
            table.pop(key, None)

    FakeTabularStoreService._store = {}
    monkeypatch.setattr(
        "engines.registry.repository.TabularStoreService",
        FakeTabularStoreService,
    )
    return FakeTabularStoreService


@pytest.fixture
def registry_service(fake_tabular) -> SystemRegistryService:
    service = SystemRegistryService()
    set_system_registry_service(service)
    return service


from engines.identity.auth import get_auth_context

@pytest.fixture
def registry_app(registry_service: SystemRegistryService) -> FastAPI:
    app = FastAPI()
    register_error_handlers(app)
    app.include_router(router)
    return app


@pytest.fixture
def registry_client(registry_app: FastAPI) -> TestClient:
    return TestClient(registry_app)


def test_get_namespaces(
    registry_client: TestClient,
    registry_headers: Dict[str, str],
) -> None:
    response = registry_client.get("/registry/namespaces", headers=registry_headers)
    assert response.status_code == 200
    assert "connectors" in response.json()
    assert "firearms" in response.json()


def test_crud_entry(
    registry_client: TestClient,
    registry_headers: Dict[str, str],
) -> None:
    # Create
    entry = {
        "id": "my-kpi-1",
        "namespace": "kpi",
        "key": "revenue",
        "name": "Revenue",
        "config": {"unit": "USD"},
        "enabled": True,
        "tenant_id": "t_system"
    }
    response = registry_client.post("/registry/kpi", json=entry, headers=registry_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["key"] == "revenue"

    # Read
    response = registry_client.get("/registry/kpi", headers=registry_headers)
    assert response.status_code == 200
    items = response.json()
    assert len(items) == 1
    assert items[0]["key"] == "revenue"

    # Delete
    response = registry_client.delete("/registry/kpi/revenue", headers=registry_headers)
    assert response.status_code == 204

    # Read again
    response = registry_client.get("/registry/kpi", headers=registry_headers)
    assert response.status_code == 200
    assert len(response.json()) == 0


def test_validation_failure(
    registry_client: TestClient,
    registry_headers: Dict[str, str],
) -> None:
    # Missing auth_type for connector
    entry = {
        "id": "bad-conn",
        "namespace": "connectors",
        "key": "bad",
        "name": "Bad",
        "config": {}, # Missing auth_type
        "tenant_id": "t_system"
    }
    response = registry_client.post("/registry/connectors", json=entry, headers=registry_headers)
    assert response.status_code == 400
    assert response.json()["error"]["code"] == "registry.invalid_config"


def test_seeding_connectors(
    registry_client: TestClient,
    registry_headers: Dict[str, str],
) -> None:
    # Initially empty (assuming fresh fixture) - but fixture is function scoped?
    # Actually, seeding happens on list if empty.

    response = registry_client.get("/registry/connectors", headers=registry_headers)
    assert response.status_code == 200
    items = response.json()

    # Should be seeded
    keys = [item["key"] for item in items]
    assert "shopify" in keys
    assert "youtube" in keys
    assert len(keys) >= 2


def test_seeding_firearms(
    registry_client: TestClient,
    registry_headers: Dict[str, str],
) -> None:
    response = registry_client.get("/registry/firearms", headers=registry_headers)
    assert response.status_code == 200
    items = response.json()

    keys = [item["key"] for item in items]
    assert "commercial_license" in keys
    assert "nuke_license" in keys
