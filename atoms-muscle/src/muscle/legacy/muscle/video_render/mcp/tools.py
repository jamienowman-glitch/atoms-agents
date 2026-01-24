from typing import Any, Dict
from pydantic import BaseModel, Field

from engines.muscle.video_render.core.logic import get_render_service
from engines.muscle.video_render.models import RenderRequest

class RenderInput(BaseModel):
    project_id: str = Field(..., description="The project ID to render")
    profile: str = Field("preview_720p_fast", description="Render profile")

async def render_tool(ctx, args: RenderInput) -> Dict[str, Any]:
    service = get_render_service()
    # Map to RenderRequest.
    # Context should provide tenant_id etc.
    # For now we mock or assume ctx has it.
    req = RenderRequest(
        tenant_id=ctx.tenant_id,
        env=ctx.env,
        user_id=ctx.user_id,
        project_id=args.project_id,
        render_profile=args.profile
    )
    result = service.create_job(req)
    return {"job_id": result.id, "status": result.status}
