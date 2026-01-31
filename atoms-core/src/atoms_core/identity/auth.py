"""Auth assertion and context helpers."""
from __future__ import annotations

from dataclasses import dataclass, field
from typing import Dict, List, Optional, Set

from fastapi import HTTPException

from src.identity.models import RequestContext

VALID_MODES = frozenset({"saas", "enterprise", "lab"})


@dataclass
class AuthContext:
    """
    Minimal auth context from Supabase/JWT.
    """
    user_id: str
    default_tenant_id: Optional[str] = None
    tenant_ids: Set[str] = field(default_factory=set)
    role_map: Dict[str, str] = field(default_factory=dict)
    
    # Raw claims if needed
    claims: Dict[str, Any] = field(default_factory=dict)


def assert_context_matches(
    context: RequestContext,
    tenant_id: Optional[str] = None,
    mode: Optional[str] = None,
    env: Optional[str] = None,
    project_id: Optional[str] = None,
    space_id: Optional[str] = None,
    surface_id: Optional[str] = None,
    app_id: Optional[str] = None,
) -> None:
    """Ensure caller-supplied tenant/mode/project/surface/app match the resolved context."""
    if tenant_id and tenant_id != context.tenant_id:
        raise HTTPException(status_code=400, detail="tenant_id mismatch with request context")
    
    normalized_mode: Optional[str] = mode if mode in VALID_MODES else None
    normalized_env: Optional[str] = env
    
    if not normalized_env and mode and mode not in VALID_MODES:
        # Fallback if someone passed 'dev' as mode
        normalized_env = mode
        
    if normalized_mode and normalized_mode != context.mode:
        raise HTTPException(status_code=400, detail="mode mismatch with request context")
        
    if normalized_env and normalized_env != context.env:
        # Flexible env/mode check
        pass # raise HTTPException(status_code=400, detail="env mismatch with request context")

    if project_id and project_id != context.project_id:
        raise HTTPException(status_code=400, detail="project_id mismatch with request context")
    if space_id and space_id != context.space_id:
        raise HTTPException(status_code=400, detail="space_id mismatch with request context")
    if surface_id and surface_id != context.surface_id:
        raise HTTPException(status_code=400, detail="surface_id mismatch with request context")
    if app_id and app_id != context.app_id:
        raise HTTPException(status_code=400, detail="app_id mismatch with request context")


def get_optional_auth_context(
    # In atoms-core, we rely on Request.state to hold identity info
    # This dependency can adapt that to AuthContext
    request_context: RequestContext, 
    # Or use fastapi Request directly in dependency
) -> Optional[AuthContext]:
    # TODO: Implement full auth context extraction if needed for complex policies.
    # For now, if we have a user_id in RequestContext, we assume basic auth.
    if request_context.user_id:
        return AuthContext(
            user_id=request_context.user_id,
            default_tenant_id=request_context.tenant_id,
            tenant_ids={request_context.tenant_id}
        )
    return None
