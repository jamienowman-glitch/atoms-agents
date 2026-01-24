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
