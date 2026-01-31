"""Identity dependencies for FastAPI."""
from typing import Optional

from fastapi import Request

from .auth import AuthContext
from .models import RequestContext


async def get_request_context(request: Request) -> RequestContext:
    """Extract RequestContext from request state (populated by middleware)."""
    # Use defaults if state is not fully populated (e.g. tests without middleware)
    tenant_id = getattr(request.state, "tenant_id", "t_default") or "t_default"
    user_id = getattr(request.state, "user_id", None)
    space_id = getattr(request.state, "space_id", None)

    return RequestContext(
        tenant_id=tenant_id,
        mode="saas",
        project_id="p_default", # Default project
        env="dev",
        user_id=user_id,
        space_id=space_id,
        request_id=getattr(request.state, "request_id", None) or "req_stub",
    )


async def get_auth_context(request: Request) -> AuthContext:
    """Extract AuthContext from request state."""
    user_id = getattr(request.state, "user_id", "anon")
    tenant_id = getattr(request.state, "tenant_id", None)

    return AuthContext(
        user_id=user_id,
        default_tenant_id=tenant_id,
        tenant_ids={tenant_id} if tenant_id else set(),
    )
