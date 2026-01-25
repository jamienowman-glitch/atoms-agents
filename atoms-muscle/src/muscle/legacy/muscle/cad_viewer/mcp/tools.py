from typing import Any, Dict
from pydantic import BaseModel, Field

from engines.muscle.cad_viewer.core.logic import get_cad_viewer_service

class CadViewInput(BaseModel):
    project_id: str
    cost_model_id: str

async def view_gantt(ctx, args: CadViewInput) -> Dict[str, Any]:
    svc = get_cad_viewer_service()
    # Mock context or pass it
    view = svc.build_gantt_view(args.project_id, args.cost_model_id, context={"tenant_id": ctx.tenant_id, "env": ctx.env, "request_id": "mcp"})
    return view.model_dump()

async def view_overlay(ctx, args: CadViewInput) -> Dict[str, Any]:
    svc = get_cad_viewer_service()
    view = svc.build_overlay_view(args.project_id, args.cost_model_id, context={"tenant_id": ctx.tenant_id, "env": ctx.env, "request_id": "mcp"})
    return view.model_dump()
