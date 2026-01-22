"""Whiteboard store service with registry routing (concrete scope)."""
from __future__ import annotations

import logging
from typing import Any, Dict, List, Optional

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


class WhiteboardStoreService:
    """Resolves whiteboard_store backend via routing registry."""

    def __init__(self, context: RequestContext) -> None:
        self._context = context
        self._adapter = self._resolve_adapter()

    def _resolve_adapter(self):
        try:
            registry = routing_registry()
            route = registry.get_route(
                resource_kind=WHITEBOARD_STORE,
                tenant_id=self._context.tenant_id,
                env=self._context.env,
                project_id=self._context.project_id,
            )

            if not route:
                raise MissingRoutingConfig(
                    f"No route configured for whiteboard_store in {self._context.tenant_id}/{self._context.env}. "
                    "Configure via /routing/routes with backend_type=firestore|dynamodb|cosmos."
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
        except MissingRoutingConfig as e:
            raise RuntimeError(str(e)) from e

    def write(
        self,
        key: str,
        value: Any,
        run_id: str,
        edge_id: str,
        expected_version: Optional[int] = None,
    ) -> Dict[str, Any]:
        if not run_id:
            raise ValueError("run_id is required")
        if not edge_id:
            raise ValueError("edge_id is required")

        try:
            return self._adapter.write(
                key,
                value,
                self._context,
                run_id,
                expected_version,
                edge_id=edge_id,
            )
        except VersionConflictError:
            raise
        except Exception as exc:
            logger.error(f"Whiteboard write failed for key '{key}': {exc}")
            raise

    def read(
        self,
        key: str,
        run_id: str,
        edge_id: str,
        version: Optional[int] = None,
    ) -> Optional[Dict[str, Any]]:
        if not run_id:
            raise ValueError("run_id is required")
        if not edge_id:
            raise ValueError("edge_id is required")

        try:
            return self._adapter.read(key, self._context, run_id, version, edge_id=edge_id)
        except Exception as exc:
            logger.error(f"Whiteboard read failed for key '{key}': {exc}")
            return None

    def list_keys(self, run_id: str, edge_id: str) -> List[str]:
        if not run_id:
            raise ValueError("run_id is required")
        if not edge_id:
            raise ValueError("edge_id is required")

        try:
            return self._adapter.list_keys(self._context, run_id, edge_id=edge_id)
        except Exception as exc:
            logger.error(f"Whiteboard list_keys failed for run {run_id}: {exc}")
            return []
