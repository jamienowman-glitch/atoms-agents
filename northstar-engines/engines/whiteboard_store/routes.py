"""Whiteboard HTTP routes with strict run scoping."""
from __future__ import annotations

import asyncio
import logging
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel, Field

from engines.common.identity import RequestContext, get_request_context
from engines.common.error_envelope import error_response, missing_route_error
from engines.identity.auth import AuthContext, get_auth_context, require_tenant_membership
from engines.realtime.run_stream import publish_run_event
from engines.whiteboard_store.cloud_whiteboard_store import VersionConflictError
from engines.whiteboard_store.service import WhiteboardStoreService
from engines.whiteboard_store.service_reject import (
    MissingWhiteboardStoreRoute,
    WhiteboardStoreServiceRejectOnMissing,
)

router = APIRouter(prefix="/whiteboard", tags=["whiteboard"])
logger = logging.getLogger(__name__)


def _require_membership(auth: AuthContext, context: RequestContext) -> None:
    try:
        require_tenant_membership(auth, context.tenant_id)
    except Exception as exc:  # noqa: BLE001
        error_response(
            code="auth.tenant_membership_required",
            message=str(exc),
            status_code=403,
            resource_kind="whiteboard_store",
        )


def _resolve_service(
    context: RequestContext = Depends(get_request_context),
) -> WhiteboardStoreService | WhiteboardStoreServiceRejectOnMissing:
    try:
        return WhiteboardStoreService(context)
    except RuntimeError:
        return WhiteboardStoreServiceRejectOnMissing(context)


class WriteWhiteboardRequest(BaseModel):
    key: str = Field(..., description="Unique identifier within run")
    value: Any = Field(..., description="Serializable payload")
    run_id: str = Field(..., description="Run identifier for provenance")
    edge_id: str = Field(..., description="Edge identifier (global for whiteboard)")
    expected_version: Optional[int] = Field(None, description="Optimistic version")


class WriteWhiteboardResponse(BaseModel):
    key: str
    edge_id: str
    version: int
    created_by: str
    created_at: str
    modified_by_user_id: str
    modified_at: str
    status: str = "written"


class ReadWhiteboardResponse(BaseModel):
    key: str
    edge_id: str
    value: Optional[Any] = None
    version: Optional[int] = None
    created_by: Optional[str] = None
    created_at: Optional[str] = None
    modified_by_user_id: Optional[str] = None
    modified_at: Optional[str] = None
    found: bool = False


class ListKeysResponse(BaseModel):
    run_id: str
    edge_id: str
    keys: List[str]
    count: int


async def _emit_whiteboard_write_event(
    context: RequestContext,
    run_id: str,
    edge_id: str,
    key: str,
    version: int,
) -> None:
    try:
        await publish_run_event(
            context,
            run_id,
            "whiteboard.write",
            {"key": key, "version": version, "edge_id": edge_id},
        )
    except Exception:
        logger.warning("Failed to publish run event for whiteboard %s", run_id)


def _schedule_run_event(context: RequestContext, run_id: str, edge_id: str, key: str, version: int) -> None:
    asyncio.create_task(_emit_whiteboard_write_event(context, run_id, edge_id, key, version))


@router.post("/write", response_model=WriteWhiteboardResponse)
def write_value(
    payload: WriteWhiteboardRequest,
    context: RequestContext = Depends(get_request_context),
    auth: AuthContext = Depends(get_auth_context),
    service: WhiteboardStoreService | WhiteboardStoreServiceRejectOnMissing = Depends(_resolve_service),
):
    _require_membership(auth, context)
    try:
        result = service.write(
            key=payload.key,
            value=payload.value,
            run_id=payload.run_id,
            edge_id=payload.edge_id,
            expected_version=payload.expected_version,
        )
        _schedule_run_event(context, payload.run_id, payload.edge_id, payload.key, result.get("version"))
        return WriteWhiteboardResponse(
            key=result.get("key"),
            edge_id=payload.edge_id,
            version=result.get("version"),
            created_by=result.get("created_by"),
            created_at=result.get("created_at"),
            modified_by_user_id=result.get("modified_by_user_id"),
            modified_at=result.get("modified_at"),
        )
    except MissingWhiteboardStoreRoute as exc:
        missing_route_error(
            resource_kind="whiteboard_store",
            tenant_id=context.tenant_id,
            env=context.env,
            status_code=exc.status_code,
        )
    except VersionConflictError as exc:
        error_response(
            code="whiteboard.version_conflict",
            message=str(exc),
            status_code=409,
            resource_kind="whiteboard_store",
        )
    except Exception as exc:
        error_response(
            code="whiteboard.write_failed",
            message=str(exc),
            status_code=500,
            resource_kind="whiteboard_store",
        )


@router.get("/read", response_model=ReadWhiteboardResponse)
def read_value(
    run_id: str = Query(..., description="Run identifier"),
    edge_id: str = Query(..., description="Edge identifier"),
    key: str = Query(..., description="Key to read"),
    version: Optional[int] = Query(None, description="Specific version"),
    context: RequestContext = Depends(get_request_context),
    service: WhiteboardStoreService | WhiteboardStoreServiceRejectOnMissing = Depends(_resolve_service),
):
    try:
        result = service.read(key=key, run_id=run_id, edge_id=edge_id, version=version)
        if not result:
            return ReadWhiteboardResponse(key=key, edge_id=edge_id, found=False)
        return ReadWhiteboardResponse(
            key=result.get("key"),
            edge_id=edge_id,
            value=result.get("value"),
            version=result.get("version"),
            created_by=result.get("created_by"),
            created_at=result.get("created_at"),
            modified_by_user_id=result.get("modified_by_user_id"),
            modified_at=result.get("modified_at"),
            found=True,
        )
    except MissingWhiteboardStoreRoute as exc:
        missing_route_error(
            resource_kind="whiteboard_store",
            tenant_id=context.tenant_id,
            env=context.env,
            status_code=exc.status_code,
        )
    except Exception as exc:
        error_response(
            code="whiteboard.read_failed",
            message=str(exc),
            status_code=500,
            resource_kind="whiteboard_store",
        )


@router.get("/list-keys", response_model=ListKeysResponse)
def list_keys(
    run_id: str = Query(..., description="Run identifier"),
    edge_id: str = Query(..., description="Edge identifier"),
    context: RequestContext = Depends(get_request_context),
    service: WhiteboardStoreService | WhiteboardStoreServiceRejectOnMissing = Depends(_resolve_service),
):
    try:
        keys = service.list_keys(run_id, edge_id)
        return ListKeysResponse(run_id=run_id, edge_id=edge_id, keys=keys, count=len(keys))
    except MissingWhiteboardStoreRoute as exc:
        missing_route_error(
            resource_kind="whiteboard_store",
            tenant_id=context.tenant_id,
            env=context.env,
            status_code=exc.status_code,
        )
    except Exception as exc:
        error_response(
            code="whiteboard.list_keys_failed",
            message=str(exc),
            status_code=500,
            resource_kind="whiteboard_store",
        )
