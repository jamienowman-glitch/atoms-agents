from __future__ import annotations

from typing import Optional, List

from fastapi import APIRouter, Depends, HTTPException, Query, Request

from src.identity.auth import assert_context_matches
from src.identity.models import RequestContext
from src.temperature.models import TemperatureCeilingConfig, TemperatureFloorConfig, TemperatureWeights
from src.temperature.service import get_temperature_service

router = APIRouter(prefix="/temperature", tags=["temperature"])


def _require_role(identity: RequestContext, roles: List[str]) -> None:
    if identity.membership_role and identity.membership_role not in roles:
        raise HTTPException(status_code=403, detail="Forbidden")


def get_request_context(request: Request) -> RequestContext:
    if not request.state.user_id:
        raise HTTPException(status_code=401, detail="Unauthorized")
    tenant_id = request.state.tenant_id or request.headers.get("X-Tenant-Id")
    project_id = request.headers.get("X-Project-Id")
    if not tenant_id or not project_id:
        raise HTTPException(status_code=400, detail="X-Tenant-Id and X-Project-Id required")

    mode = request.headers.get("X-Mode") or "saas"
    env = request.headers.get("X-Env") or "dev"
    return RequestContext(
        tenant_id=tenant_id,
        mode=mode,  # type: ignore
        env=env,
        project_id=project_id,
        surface_id=request.headers.get("X-Surface-Id"),
        app_id=request.headers.get("X-App-Id"),
        user_id=request.state.user_id,
        membership_role=request.state.role,
        space_id=request.headers.get("X-Space-Id"),
        request_id=request.headers.get("X-Request-Id") or None,
    )


@router.put("/floors")
def put_floors(
    cfg: TemperatureFloorConfig,
    context: RequestContext = Depends(get_request_context),
):
    assert_context_matches(context, tenant_id=cfg.tenant_id, env=cfg.env, project_id=context.project_id, space_id=cfg.space_id)
    _require_role(context, ["owner", "admin"])
    return get_temperature_service().upsert_floor(context, cfg)


@router.put("/ceilings")
def put_ceilings(
    cfg: TemperatureCeilingConfig,
    context: RequestContext = Depends(get_request_context),
):
    assert_context_matches(context, tenant_id=cfg.tenant_id, env=cfg.env, project_id=context.project_id, space_id=cfg.space_id)
    _require_role(context, ["owner", "admin"])
    return get_temperature_service().upsert_ceiling(context, cfg)


@router.put("/weights")
def put_weights(
    cfg: TemperatureWeights,
    context: RequestContext = Depends(get_request_context),
):
    assert_context_matches(context, tenant_id=cfg.tenant_id, env=cfg.env, project_id=context.project_id, space_id=cfg.space_id)
    _require_role(context, ["owner", "admin"])
    return get_temperature_service().upsert_weights(context, cfg)


@router.get("/config")
def get_config(
    space_id: str,
    context: RequestContext = Depends(get_request_context),
):
    return get_temperature_service().get_config_bundle(context, space_id)


@router.get("/current")
def get_current_temperature(
    space_id: str,
    surface_ids: Optional[str] = Query(default=None, description="comma-separated surface ids"),
    window_days: int = Query(7, ge=1, le=90),
    context: RequestContext = Depends(get_request_context),
):
    surfaces = [s.strip() for s in surface_ids.split(",")] if surface_ids else None
    return get_temperature_service().compute_temperature(context, space_id, surface_ids=surfaces, window_days=window_days)


@router.get("/history")
def get_history(
    space_id: str,
    limit: int = Query(20, ge=1, le=200),
    offset: int = Query(0, ge=0),
    context: RequestContext = Depends(get_request_context),
):
    snaps = get_temperature_service().list_snapshots(context, space_id, limit=limit, offset=offset)
    return {"items": snaps}
