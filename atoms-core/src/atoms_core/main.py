from fastapi import FastAPI, Request, HTTPException, Depends
from src.identity.middleware import IdentityMiddleware
from src.identity.constants import ROOT_TENANT_ID

app = FastAPI(title="Atoms Core")

# Register Middleware
app.add_middleware(IdentityMiddleware)


@app.get("/health")
async def health():
    return {"status": "ok"}

@app.get("/api/v1/config/status")
async def config_status():
    """
    Returns the status of the configuration loader.
    Masks secrets for security.
    """
    from src.config import get_settings
    settings = get_settings()
    
    def mask(s: str) -> str:
        if len(s) < 8: return "****"
        return f"LOADED (ends in ...{s[-4:]})"

    return {
        "SUPABASE_URL": mask(settings.SUPABASE_URL),
        "SUPABASE_ANON_KEY": mask(settings.SUPABASE_ANON_KEY),
        "OPENAI_API_KEY": mask(settings.OPENAI_API_KEY),
        "SYSTEM_KEY": mask(settings.SYSTEM_KEY),
        "GSM_CONNECTED": settings.GSM_CONNECTED
    }

async def require_auth(request: Request):
    """Dependency to ensure user is authenticated."""
    if not request.state.user_id:
        raise HTTPException(status_code=401, detail="Unauthorized: Missing or invalid credentials")
    return request.state

@app.get("/api/v1/bootstrap")
async def bootstrap(identity = Depends(require_auth)):
    """
    Returns the initial context for the user.
    Phase 1: Returns simplified Identity triplet.
    """

    # 1. User ID (Always present if auth passed)
    user_id = identity.user_id

    # 2. Tenant ID (From header, System context, or Stub)
    tenant_id = identity.tenant_id
    if not tenant_id:
        # Phase 1 Fallback: In a real app, we'd query the DB for the user's last active tenant.
        tenant_id = "t_demo_workspace"

    # 3. Role (From System context or Stub)
    role = identity.role
    if not role:
        # Phase 1 Fallback: We assume owner for the demo workspace
        role = "owner"

    return {
        "user": user_id,
        "tenant": tenant_id,
        "role": role
    }

from src.nexus.routes import router as nexus_router
from src.vault.routes import router as vault_router
from src.budget.routes import router as budget_router
app.include_router(nexus_router)
app.include_router(vault_router)
app.include_router(budget_router)

# Realtime
from src.realtime.sse import router as sse_router
from src.realtime.ws import router as ws_router
app.include_router(sse_router)
app.include_router(ws_router)

# Temperature
from src.temperature.routes import router as temperature_router
app.include_router(temperature_router)

# Maybes
from src.maybes.routes import router as maybes_router
app.include_router(maybes_router)

# Event Spine V2
from src.event_spine.routes import router as event_spine_router
app.include_router(event_spine_router)
