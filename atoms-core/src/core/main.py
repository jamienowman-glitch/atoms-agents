from fastapi import FastAPI, Request, HTTPException, Depends
from src.core.identity.middleware import IdentityMiddleware
from src.core.identity.constants import ROOT_TENANT_ID

app = FastAPI(title="Atoms Core")

# Register Middleware
app.add_middleware(IdentityMiddleware)

@app.get("/health")
async def health():
    return {"status": "ok"}

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
