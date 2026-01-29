from __future__ import annotations

from typing import Any, Dict, Optional

from fastapi import APIRouter, Depends, HTTPException

from muscle.engines.common.identity_stub import (
    RequestContext,
    get_request_context,
)
from muscle.engines.identity.auth_stub import AuthContext, get_auth_context

from atoms_core.src.animation.models import AgentAnimInstruction
from atoms_core.src.animation.logic import AnimationService
from atoms_core.src.billing.decorators import require_snax

router = APIRouter(prefix="/video/animation", tags=["animation_kernel"])

_service = AnimationService()

@router.post("/execute", response_model=Any)
@require_snax(cost_per_unit=5)
def execute_animation_instruction(
    instruction: AgentAnimInstruction,
    request_context: RequestContext = Depends(get_request_context),
    auth_context: AuthContext = Depends(get_auth_context),
):
    try:
        return _service.execute_instruction(instruction)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))
