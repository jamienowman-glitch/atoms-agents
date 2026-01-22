"""BB-01: Blackboard Store HTTP Routes (Versioned Writes + Optimistic Concurrency).

Endpoints:
- POST /blackboard/write — Versioned write with optimistic concurrency
- GET /blackboard/read — Read specific version or latest
- GET /blackboard/list-keys — List all keys in blackboard
- POST /board/{key} — Commit turn with distillation
- GET /board/{key} — Read board state (full or summary)
"""
import asyncio
import logging

from fastapi import APIRouter, Depends, HTTPException, Query, Body
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List, Union

from engines.common.identity import (
    RequestContext,
    get_request_context,
)
from engines.common.error_envelope import error_response, missing_route_error
from engines.identity.auth import get_auth_context, require_tenant_membership
from engines.realtime.run_stream import publish_run_event
from engines.blackboard_store.service_reject import (
    BlackboardStoreServiceRejectOnMissing,
    MissingBlackboardStoreRoute,
)
from engines.blackboard_store.service import BlackboardStoreService
from engines.blackboard_store.cloud_blackboard_store import VersionConflictError
from engines.blackboard_store.models import BlackboardState

router = APIRouter(prefix="/api/v1", tags=["blackboard_store"])
logger = logging.getLogger(__name__)


# Request/Response Models
class WriteBlackboardRequest(BaseModel):
    """Request to write versioned value to blackboard."""
    run_id: str = Field(..., description="Run identifier for provenance")
    edge_id: str = Field(..., description="Edge identifier for this board write")
    key: str = Field(..., description="Unique identifier within run")
    value: Dict[str, Any] = Field(..., description="Value to store (must be JSON-serializable)")
    expected_version: Optional[int] = Field(None, description="Expected version; None = new key")


class WriteBlackboardResponse(BaseModel):
    """Response after write."""
    key: str
    edge_id: str
    version: int
    created_by: str
    created_at: str
    modified_by_user_id: str
    modified_at: str
    updated_by: str
    updated_at: str
    status: str = "written"


class ReadBlackboardResponse(BaseModel):
    """Response from read."""
    key: str
    edge_id: str
    value: Optional[Dict[str, Any]] = None
    version: Optional[int] = None
    created_by: Optional[str] = None
    created_at: Optional[str] = None
    modified_by_user_id: Optional[str] = None
    modified_at: Optional[str] = None
    updated_by: Optional[str] = None
    updated_at: Optional[str] = None
    found: bool = False


class ListKeysResponse(BaseModel):
    """Response from list_keys."""
    run_id: str
    edge_id: str
    keys: list[str]
    count: int


async def _emit_blackboard_write_event(
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
            "blackboard.write",
            {"key": key, "version": version, "edge_id": edge_id},
        )
    except Exception:
        logger.warning("Failed to publish run event for blackboard %s/%s", run_id, edge_id)


def _schedule_blackboard_event(
    context: RequestContext,
    run_id: str,
    edge_id: str,
    key: str,
    version: int,
) -> None:
    asyncio.create_task(_emit_blackboard_write_event(context, run_id, edge_id, key, version))


class CommitTurnRequest(BaseModel):
    """Request to commit a turn."""
    run_id: str = Field(..., description="Run identifier")
    edge_id: str = Field(..., description="Edge identifier")
    data: Dict[str, Any] = Field(..., description="New raw data")
    active_agents: Optional[List[str]] = Field(None, description="List of active agents")
    auto_distill: bool = Field(True, description="Whether to run auto-distillation")

class BoardViewResponse(BaseModel):
    """Response for board view."""
    key: str
    version: int
    raw_data: Optional[Dict[str, Any]] = None
    distilled_context: Optional[str] = None
    takeaways: Optional[List[str]] = None
    active_agents: Optional[List[str]] = None
    view_mode: str

# Endpoints

@router.post("/blackboard/write", response_model=WriteBlackboardResponse)
async def write_blackboard(
    payload: WriteBlackboardRequest,
    context: RequestContext = Depends(get_request_context),
    auth=Depends(get_auth_context),
):
    """Write versioned value to blackboard (optimistic concurrency)."""
    try:
        require_tenant_membership(auth, context.tenant_id)

        svc = BlackboardStoreServiceRejectOnMissing(context)
        result = svc.write(
            key=payload.key,
            value=payload.value,
            expected_version=payload.expected_version,
            run_id=payload.run_id,
            edge_id=payload.edge_id,
        )
        _schedule_blackboard_event(
            context,
            payload.run_id,
            payload.edge_id,
            payload.key,
            result.get("version"),
        )
        return WriteBlackboardResponse(
            key=result.get("key"),
            edge_id=payload.edge_id,
            version=result.get("version"),
            created_by=result.get("created_by"),
            created_at=result.get("created_at"),
            modified_by_user_id=result.get("modified_by_user_id"),
            modified_at=result.get("modified_at"),
            updated_by=result.get("updated_by"),
            updated_at=result.get("updated_at"),
        )
    except MissingBlackboardStoreRoute as e:
        missing_route_error(resource_kind="blackboard_store", tenant_id=context.tenant_id, env=context.env, status_code=503)
    except VersionConflictError as e:
        error_response(code="blackboard.version_conflict", message=str(e), status_code=409, resource_kind="blackboard_store", details={"key": payload.key})
    except HTTPException:
        raise
    except Exception as e:
        error_response(code="blackboard.write_failed", message=str(e), status_code=500, resource_kind="blackboard_store", details={"key": payload.key})


@router.get("/blackboard/read", response_model=ReadBlackboardResponse)
async def read_blackboard(
    run_id: str = Query(..., description="Run identifier"),
    edge_id: str = Query(..., description="Edge identifier"),
    key: str = Query(..., description="Key to read"),
    version: Optional[int] = Query(None, description="Specific version"),
    context: RequestContext = Depends(get_request_context),
):
    """Read versioned value from blackboard."""
    try:
        svc = BlackboardStoreServiceRejectOnMissing(context)
        result = svc.read(key=key, run_id=run_id, edge_id=edge_id, version=version)

        if result is None:
            return ReadBlackboardResponse(key=key, edge_id=edge_id, found=False)
        
        return ReadBlackboardResponse(
            key=result.get("key"),
            edge_id=edge_id,
            value=result.get("value"),
            version=result.get("version"),
            created_by=result.get("created_by"),
            created_at=result.get("created_at"),
            modified_by_user_id=result.get("modified_by_user_id"),
            modified_at=result.get("modified_at"),
            updated_by=result.get("updated_by"),
            updated_at=result.get("updated_at"),
            found=True,
        )
    except MissingBlackboardStoreRoute as e:
        missing_route_error(resource_kind="blackboard_store", tenant_id=context.tenant_id, env=context.env, status_code=503)
    except HTTPException:
        raise
    except Exception as e:
        error_response(code="blackboard.read_failed", message=str(e), status_code=500, resource_kind="blackboard_store", details={"key": key})


@router.get("/blackboard/list-keys", response_model=ListKeysResponse)
async def list_blackboard_keys(
    run_id: str = Query(..., description="Run identifier"),
    edge_id: str = Query(..., description="Edge identifier"),
    context: RequestContext = Depends(get_request_context),
):
    """List all keys in blackboard for given run."""
    try:
        svc = BlackboardStoreServiceRejectOnMissing(context)
        keys = svc.list_keys(run_id=run_id, edge_id=edge_id)
        return ListKeysResponse(run_id=run_id, edge_id=edge_id, keys=keys, count=len(keys))
    except MissingBlackboardStoreRoute as e:
        missing_route_error(resource_kind="blackboard_store", tenant_id=context.tenant_id, env=context.env, status_code=503)
    except HTTPException:
        raise
    except Exception as e:
        error_response(code="blackboard.list_keys_failed", message=str(e), status_code=500, resource_kind="blackboard_store", details={"run_id": run_id})

# --- New Routes ---

@router.post("/board/{key}", response_model=WriteBlackboardResponse)
async def commit_board_turn(
    key: str,
    payload: CommitTurnRequest,
    context: RequestContext = Depends(get_request_context),
    auth=Depends(get_auth_context),
):
    """Commit a turn to the blackboard with optional distillation."""
    try:
        require_tenant_membership(auth, context.tenant_id)

        # Use the service with distillation capability
        svc = BlackboardStoreService(context)
        
        result = await svc.commit_turn(
            key=key,
            data=payload.data,
            run_id=payload.run_id,
            edge_id=payload.edge_id,
            auto_distill=payload.auto_distill,
            active_agents=payload.active_agents,
        )
        _schedule_blackboard_event(
            context,
            payload.run_id,
            payload.edge_id,
            key,
            result.get("version"),
        )

        return WriteBlackboardResponse(
            key=result.get("key"),
            edge_id=payload.edge_id,
            version=result.get("version"),
            created_by=result.get("created_by"),
            created_at=result.get("created_at"),
            modified_by_user_id=result.get("modified_by_user_id"),
            modified_at=result.get("modified_at"),
            updated_by=result.get("updated_by"),
            updated_at=result.get("updated_at"),
        )
    except RuntimeError as e:
        # Check if it is a missing route error from Service
        if "No route configured" in str(e):
             missing_route_error(resource_kind="blackboard_store", tenant_id=context.tenant_id, env=context.env, status_code=503)
        error_response(code="board.commit_failed", message=str(e), status_code=500, resource_kind="blackboard_store")
    except HTTPException:
        raise
    except Exception as e:
        error_response(code="board.commit_failed", message=str(e), status_code=500, resource_kind="blackboard_store")


@router.get("/board/{key}", response_model=BoardViewResponse)
async def get_board_view(
    key: str,
    run_id: str = Query(..., description="Run identifier"),
    view_mode: str = Query("full", description="View mode: 'full' or 'summary'"),
    context: RequestContext = Depends(get_request_context),
):
    """Get board state in full or summary mode."""
    try:
        svc = BlackboardStoreService(context)
        result = svc.read(key=key, run_id=run_id)

        if not result:
             raise HTTPException(status_code=404, detail="Board not found")

        val = result.get("value")
        version = result.get("version")

        # Parse state
        state = None
        if isinstance(val, dict) and "distilled_context" in val:
             try:
                 state = BlackboardState(**val)
             except:
                 pass

        if not state:
            # Legacy or empty
            raw_data = val if isinstance(val, dict) else {"value": val}
            state = BlackboardState(
                version=version or 0,
                raw_data=raw_data,
                distilled_context="Legacy data",
                takeaways=[],
                active_agents=[]
            )

        resp = BoardViewResponse(
            key=key,
            version=version or 0,
            view_mode=view_mode
        )

        if view_mode == "summary":
            resp.distilled_context = state.distilled_context
            resp.takeaways = state.takeaways
            # In summary mode, we might exclude raw_data
        else:
            resp.distilled_context = state.distilled_context
            resp.takeaways = state.takeaways
            resp.raw_data = state.raw_data
            resp.active_agents = state.active_agents

        return resp

    except RuntimeError as e:
        if "No route configured" in str(e):
             missing_route_error(resource_kind="blackboard_store", tenant_id=context.tenant_id, env=context.env, status_code=503)
        error_response(code="board.read_failed", message=str(e), status_code=500, resource_kind="blackboard_store")
    except HTTPException:
        raise
    except Exception as e:
        error_response(code="board.read_failed", message=str(e), status_code=500, resource_kind="blackboard_store")
