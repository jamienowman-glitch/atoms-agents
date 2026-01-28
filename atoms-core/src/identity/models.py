"""Core identity and tenant models (phase 1 backbone)."""
from __future__ import annotations

from datetime import datetime, timezone
from typing import Literal, Optional
from uuid import uuid4

from pydantic import BaseModel, Field


def _now() -> datetime:
    return datetime.now(timezone.utc)


class User(BaseModel):
    id: str = Field(default_factory=lambda: uuid4().hex)
    email: str
    display_name: Optional[str] = None
    avatar_url: Optional[str] = None
    password_hash: Optional[str] = None
    created_at: datetime = Field(default_factory=_now)
    updated_at: datetime = Field(default_factory=_now)


class Tenant(BaseModel):
    id: str
    name: str
    slug: Optional[str] = None
    status: Literal["active", "disabled", "suspended"] = "active"
    created_by: Optional[str] = None
    created_at: datetime = Field(default_factory=_now)
    updated_at: datetime = Field(default_factory=_now)


class TenantMembership(BaseModel):
    id: str = Field(default_factory=lambda: uuid4().hex)
    tenant_id: str
    user_id: str
    role: Literal["owner", "admin", "member", "viewer"] = "member"
    status: Literal["active", "pending", "revoked"] = "active"
    created_at: datetime = Field(default_factory=_now)
    updated_at: datetime = Field(default_factory=_now)


class RequestContext(BaseModel):
    """
    Standard request context for multi-tenant isolation.
    Ported from northstar-engines.
    """
    tenant_id: str = Field(..., pattern=r"^t_[a-z0-9_-]+$")
    mode: Literal["saas", "enterprise", "lab"]
    project_id: str
    request_id: str = Field(default_factory=lambda: uuid4().hex)
    
    # Environment (derived from mode/env)
    env: str = "dev"
    
    # Optional Hierarchy
    surface_id: Optional[str] = None
    app_id: Optional[str] = None
    user_id: Optional[str] = None
    membership_role: Optional[str] = None
    
    # Tracing
    trace_id: Optional[str] = None
    run_id: Optional[str] = None
    step_id: Optional[str] = None
    
    # Actor / Session
    actor_id: Optional[str] = None
    session_id: Optional[str] = None

    @property
    def is_system(self) -> bool:
        return self.user_id == "system"
