"""
Event Spine V2 Routes.
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Request, Query
from .models import EventCreate
from .service import EventService
from .repository import EventRepository

router = APIRouter(prefix="/event-spine", tags=["Event Spine V2"])

def get_service():
    # Dependency injection pattern
    repo = EventRepository()
    return EventService(repo)

@router.post("/append", response_model=dict)
async def append_event(
    event_in: EventCreate,
    request: Request,
    service: EventService = Depends(get_service)
):
    """
    Appends a new event to the spine.
    Enforces Identity context from request state.
    """
    user_id = getattr(request.state, "user_id", None)
    tenant_id = getattr(request.state, "tenant_id", None)

    # Allow system or authenticated users
    if not user_id:
        raise HTTPException(status_code=401, detail="Authentication required")

    # Enforce Tenant Isolation
    # If request has a tenant_id (from header or token), the event must match it.
    # Exception: System user can write to any tenant?
    if user_id != "system":
        if tenant_id and tenant_id != event_in.tenant_id:
             raise HTTPException(status_code=403, detail=f"Tenant mismatch. Token scope: {tenant_id}, Event: {event_in.tenant_id}")

    event_id = service.append_event(event_in)
    return {"status": "ok", "event_id": event_id}

@router.get("/replay/{run_id}", response_model=List[dict])
async def replay_run(
    run_id: str,
    request: Request,
    rehydrate: bool = True,
    node_id: Optional[List[str]] = Query(None),
    canvas_id: Optional[List[str]] = Query(None),
    agent_id: Optional[List[str]] = Query(None),
    service: EventService = Depends(get_service)
):
    """
    Replays events for a specific run.
    Rehydration is allowed only for Tenant UI (authenticated members).
    Supports filtering by node_id, canvas_id, agent_id (multi-value).
    """
    user_id = getattr(request.state, "user_id", None)
    tenant_id = getattr(request.state, "tenant_id", None)

    if not user_id:
        raise HTTPException(status_code=401, detail="Authentication required")

    if not tenant_id:
         # If no tenant context in header, we might need to derive it or fail.
         # For replay, usually we are in a tenant context.
         raise HTTPException(status_code=400, detail="Tenant context required for replay")

    # TODO: Check if user is member of tenant (IdentityMiddleware does some of this or separate policy)

    # Fetch events
    events = service.get_run_events(
        tenant_id,
        run_id,
        rehydrate=rehydrate,
        node_ids=node_id,
        canvas_ids=canvas_id,
        agent_ids=agent_id
    )
    return events
