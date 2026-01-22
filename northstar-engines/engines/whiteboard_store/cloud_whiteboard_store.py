"""Run memory-backed whiteboard store (edge_id=global)."""

from __future__ import annotations

from typing import Any, Dict, List, Optional

from engines.common.identity import RequestContext
from engines.run_memory.cloud_run_memory import (
    CosmosRunMemory,
    DEFAULT_EDGE_ID,
    DynamoDBRunMemory,
    FirestoreRunMemory,
    VersionConflictError,
)

EDGE_ID_GLOBAL = DEFAULT_EDGE_ID


class FirestoreWhiteboardStore:
    """Firestore-backed whiteboard store (run_memory adapter)."""

    def __init__(self, project: Optional[str] = None, client: Optional[object] = None) -> None:
        self._adapter = FirestoreRunMemory(project=project, client=client)

    def write(
        self,
        key: str,
        value: Any,
        context: RequestContext,
        run_id: str,
        expected_version: Optional[int] = None,
    ) -> Dict[str, Any]:
        return self._adapter.write(
            key=key,
            value=value,
            context=context,
            run_id=run_id,
            expected_version=expected_version,
            edge_id=EDGE_ID_GLOBAL,
        )

    def read(
        self,
        key: str,
        context: RequestContext,
        run_id: str,
        version: Optional[int] = None,
    ) -> Optional[Dict[str, Any]]:
        return self._adapter.read(
            key=key,
            context=context,
            run_id=run_id,
            version=version,
            edge_id=EDGE_ID_GLOBAL,
        )

    def list_keys(self, context: RequestContext, run_id: str) -> List[str]:
        return self._adapter.list_keys(
            context=context,
            run_id=run_id,
            edge_id=EDGE_ID_GLOBAL,
        )


class DynamoDBWhiteboardStore:
    """DynamoDB-backed whiteboard store (run_memory adapter)."""

    def __init__(self, table_name: Optional[str] = None, region: Optional[str] = None) -> None:
        self._adapter = DynamoDBRunMemory(table_name=table_name, region=region)

    def write(
        self,
        key: str,
        value: Any,
        context: RequestContext,
        run_id: str,
        expected_version: Optional[int] = None,
    ) -> Dict[str, Any]:
        return self._adapter.write(
            key=key,
            value=value,
            context=context,
            run_id=run_id,
            expected_version=expected_version,
            edge_id=EDGE_ID_GLOBAL,
        )

    def read(
        self,
        key: str,
        context: RequestContext,
        run_id: str,
        version: Optional[int] = None,
    ) -> Optional[Dict[str, Any]]:
        return self._adapter.read(
            key=key,
            context=context,
            run_id=run_id,
            version=version,
            edge_id=EDGE_ID_GLOBAL,
        )

    def list_keys(self, context: RequestContext, run_id: str) -> List[str]:
        return self._adapter.list_keys(
            context=context,
            run_id=run_id,
            edge_id=EDGE_ID_GLOBAL,
        )


class CosmosWhiteboardStore:
    """CosmosDB-backed whiteboard store (run_memory adapter)."""

    def __init__(self, endpoint: str, key: str, database: str = "run_memory") -> None:
        self._adapter = CosmosRunMemory(endpoint=endpoint, key=key, database=database)

    def write(
        self,
        key: str,
        value: Any,
        context: RequestContext,
        run_id: str,
        expected_version: Optional[int] = None,
    ) -> Dict[str, Any]:
        return self._adapter.write(
            key=key,
            value=value,
            context=context,
            run_id=run_id,
            expected_version=expected_version,
            edge_id=EDGE_ID_GLOBAL,
        )

    def read(
        self,
        key: str,
        context: RequestContext,
        run_id: str,
        version: Optional[int] = None,
    ) -> Optional[Dict[str, Any]]:
        return self._adapter.read(
            key=key,
            context=context,
            run_id=run_id,
            version=version,
            edge_id=EDGE_ID_GLOBAL,
        )

    def list_keys(self, context: RequestContext, run_id: str) -> List[str]:
        return self._adapter.list_keys(
            context=context,
            run_id=run_id,
            edge_id=EDGE_ID_GLOBAL,
        )
