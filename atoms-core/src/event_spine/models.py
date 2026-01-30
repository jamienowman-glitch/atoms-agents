"""
Event Spine V2 Models.
"""
from __future__ import annotations
from datetime import datetime, timezone
from typing import Optional, List, Any, Dict
from uuid import uuid4
from pydantic import BaseModel, Field

def _now() -> datetime:
    return datetime.now(timezone.utc)

class EventBase(BaseModel):
    tenant_id: str
    mode: str  # saas, enterprise, system
    project_id: str
    surface_id: Optional[str] = None
    space_id: Optional[str] = None
    run_id: str
    canvas_id: Optional[str] = None
    node_id: Optional[str] = None
    agent_id: Optional[str] = None

    event_type: str
    display_name: str
    raw_name: str

    tags: Optional[List[str]] = None
    client_timestamp: Optional[datetime] = None

class EventCreate(EventBase):
    payload: Optional[Dict[str, Any]] = None
    # artifacts: Optional[List[Dict[str, Any]]] = None # Future scope

class Event(EventBase):
    id: str
    created_at: datetime

class Payload(BaseModel):
    id: str
    event_id: str
    payload_type: str
    data: Dict[str, Any]
    created_at: datetime

class PIIToken(BaseModel):
    id: str
    event_id: str
    token_key: str
    raw_value: str
    category: Optional[str] = None
    created_at: datetime

class VisibilityRule(BaseModel):
    id: str
    tenant_id: str
    rule_type: str
    is_enabled: bool
    updated_at: datetime
