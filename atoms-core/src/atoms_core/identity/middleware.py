from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse
from fastapi.concurrency import run_in_threadpool
from supabase import create_client, Client, ClientOptions
from src.config import get_settings
from src.identity.constants import ROOT_TENANT_ID, SYSTEM_KEY_HEADER

try:
    settings = get_settings()
except Exception:
    # Fallback for environments without vault access (e.g. CI/Build)
    # We create a dummy settings object or None, but middleware needs 'settings' variable.
    # We can mock it or set it to None and handle checks.
    print("Warning: Could not load settings from Vault. Running in limited mode.")
    settings = None

# Global client (initialized if config present)
supabase: Client | None = None
if settings and settings.SUPABASE_URL and settings.SUPABASE_ANON_KEY:
    try:
        supabase = create_client(
            settings.SUPABASE_URL,
            settings.SUPABASE_ANON_KEY,
            options=ClientOptions(
                postgrest_client_timeout=10,
                storage_client_timeout=10
            )
        )
    except Exception as e:
        print(f"Warning: Failed to initialize Supabase client: {e}")

class IdentityMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Initialize identity state
        request.state.user_id = None
        request.state.tenant_id = None
        request.state.role = None
        request.state.space_id = None

        # 1. System Key Check (God Mode)
        system_key = request.headers.get(SYSTEM_KEY_HEADER)
        # Only grant system access if key is configured and matches
        if settings and settings.SYSTEM_KEY and system_key == settings.SYSTEM_KEY:
            request.state.user_id = "system"
            request.state.tenant_id = ROOT_TENANT_ID
            request.state.role = "owner"

        # 2. Supabase Token Check
        elif auth_header := request.headers.get("Authorization"):
            if auth_header.startswith("Bearer ") and supabase:
                token = auth_header.split(" ")[1]
                try:
                    # Verify token via Supabase Auth (run in threadpool to avoid blocking)
                    user_response = await run_in_threadpool(supabase.auth.get_user, token)

                    if user_response and user_response.user:
                        request.state.user_id = user_response.user.id

                        # Optional: Check X-Tenant-ID header for context switching
                        if tenant_id := request.headers.get("X-Tenant-ID"):
                            request.state.tenant_id = tenant_id
                            # Role would typically be fetched from DB based on (user, tenant).
                            # For Phase 1, we leave it None or assume 'member'.
                        if space_id := request.headers.get("X-Space-Id"):
                            request.state.space_id = space_id

                except Exception as e:
                    # Token invalid or expired.
                    # We do not raise 401 here to allow public endpoints (like /health) to pass.
                    # Protected endpoints will check request.state.user_id.
                    print(f"Auth debug: {e}")
                    pass

        response = await call_next(request)
        return response
