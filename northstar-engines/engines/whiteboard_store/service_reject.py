"""Whiteboard store reject service (routing-only)."""
from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Dict, List, Optional

import logging

from engines.common.identity import RequestContext
from engines.routing.registry import MissingRoutingConfig, routing_registry
from engines.routing.resource_kinds import WHITEBOARD_STORE
from engines.whiteboard_store.cloud_whiteboard_store import (
    FirestoreWhiteboardStore,
    DynamoDBWhiteboardStore,
    CosmosWhiteboardStore,
    VersionConflictError,
)

logger = logging.getLogger(__name__)


@dataclass
class MissingWhiteboardStoreRoute(Exception):
    error_code: str = "whiteboard_store.missing_route"
    status_code: int = 503
    message: str = ""

    def __str__(self):
        return self.message


class WhiteboardStoreServiceRejectOnMissing:
    def __init__(self, context: RequestContext):
        self._context = context
        self._adapter = self._resolve_adapter_or_raise()

    def _resolve_adapter_or_raise(self):
        try:
            registry = routing_registry()
            route = registry.get_route(
                resource_kind=WHITEBOARD_STORE,
                tenant_id=self._context.tenant_id,
                env=self._context.env,
                project_id=self._context.project_id,
            )
        except MissingRoutingConfig as exc:
            raise MissingWhiteboardStoreRoute(message=str(exc))

        if route is None:
            raise MissingWhiteboardStoreRoute(
                message=(
                    f"No whiteboard_store route configured for tenant={self._context.tenant_id}, "
                    f"env={self._context.env}, mode={self._context.mode}. "
                    "Configure via /routing/routes with backend_type=firestore|dynamodb|cosmos."
                )
            )

        backend_type = (route.backend_type or "").lower()
        config = route.config or {}

        if backend_type == "firestore":
            project = config.get("project")
            return FirestoreWhiteboardStore(project=project)
        elif backend_type == "dynamodb":
            table_name = config.get("table_name", "run_memory")
            region = config.get("region", "us-west-2")
            return DynamoDBWhiteboardStore(table_name=table_name, region=region)
        elif backend_type == "cosmos":
            endpoint = config.get("endpoint")
            key = config.get("key")
            database = config.get("database", "run_memory")
            return CosmosWhiteboardStore(endpoint=endpoint, key=key, database=database)
        else:
            raise RuntimeError(
                f"Unsupported whiteboard_store backend_type='{backend_type}'. "
                "Use 'firestore', 'dynamodb', or 'cosmos'."
            )

    def write(
        self,
        key: str,
        value: Any,
        run_id: str,
        expected_version: Optional[int] = None,
    ) -> Dict[str, Any]:
        if not run_id:
            raise ValueError("run_id is required")
        try:
            return self._adapter.write(key, value, self._context, run_id, expected_version)
        except VersionConflictError:
            raise
        except Exception as exc:
            raise RuntimeError(f"Whiteboard write failed: {exc}") from exc

    def read(
        self,
        key: str,
        run_id: str,
        version: Optional[int] = None,
    ) -> Optional[Dict[str, Any]]:
        if not run_id:
            raise ValueError("run_id is required")
        try:
            return self._adapter.read(key, self._context, run_id, version)
        except Exception as exc:
            raise RuntimeError(f"Whiteboard read failed: {exc}") from exc

    def list_keys(self, run_id: str) -> List[str]:
        if not run_id:
            raise ValueError("run_id is required")
        try:
            return self._adapter.list_keys(self._context, run_id)
        except Exception as exc:
            raise RuntimeError(f"Whiteboard list_keys failed: {exc}") from exc
