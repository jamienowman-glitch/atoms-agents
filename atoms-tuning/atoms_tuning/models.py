from __future__ import annotations
from typing import Optional, Dict, Any, List
from datetime import datetime
from uuid import UUID
from pydantic import BaseModel

class TuningSession(BaseModel):
    id: Optional[UUID] = None
    run_id: str
    tenant_id: str
    agent_id: Optional[str] = None
    model_id: Optional[str] = None
    reasoning_profile_id: Optional[str] = None
    provider_id: Optional[str] = None
    framework_id: Optional[str] = None
    framework_mode_id: Optional[str] = None
    started_at: datetime
    ended_at: Optional[datetime] = None

class KPIOutcome(BaseModel):
    session_id: UUID
    run_id: str
    outcome_data: Dict[str, Any]
    score: Optional[float] = None
    created_at: datetime

class RLFeedback(BaseModel):
    session_id: UUID
    run_id: str
    feedback_type: str
    feedback_data: Dict[str, Any]
    created_at: datetime
