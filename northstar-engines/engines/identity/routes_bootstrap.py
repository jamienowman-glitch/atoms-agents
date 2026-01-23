from fastapi import APIRouter, Header, HTTPException
from typing import Optional
from engines.identity.state import identity_repo
from engines.identity.models import User, Tenant, Surface

router = APIRouter()

@router.get("/bootstrap")
async def bootstrap(x_user_id: Optional[str] = Header(None, alias="X-User-ID")):
    if not x_user_id:
        raise HTTPException(status_code=401, detail="Missing X-User-ID header")

    user = identity_repo.get_user(x_user_id)
    if not user:
        # Phase 7: Strict check for valid user
        raise HTTPException(status_code=401, detail="User not found")

    # Get Tenants
    memberships = identity_repo.list_memberships_for_user(user.id)
    if not memberships:
        raise HTTPException(status_code=403, detail="No active tenant membership")

    # Pick first active tenant
    active_membership = next((m for m in memberships if m.status == "active"), None)
    if not active_membership:
        raise HTTPException(status_code=403, detail="No active tenant membership")

    tenant = identity_repo.get_tenant(active_membership.tenant_id)
    if not tenant:
        raise HTTPException(status_code=404, detail="Tenant not found")

    # Console / Surface Logic
    # We look for a surface named 'console' or 'default'
    surfaces = identity_repo.list_surfaces_for_tenant(tenant.id)

    # Priority: "console" -> "default" -> First Available
    console_surface = next((s for s in surfaces if s.name.lower() == "console"), None)
    if not console_surface:
        console_surface = next((s for s in surfaces if s.name.lower() == "default"), None)

    if console_surface:
         console_data = {
            "id": console_surface.id,
            "name": console_surface.name,
            "theme": console_surface.metadata.get("theme", "dark"),
            "surface_id": console_surface.id
        }
    else:
        # Phase 7: Fallback Mock (The "Northstar Console" default)
        console_data = {
            "id": "agnx_console_default",
            "name": "Northstar Console",
            "theme": "dark",
            "surface_id": "s_default_mock"
        }

    response = {
        "user": user.model_dump(),
        "tenant": tenant.model_dump(),
        "console": console_data
    }

    return response
