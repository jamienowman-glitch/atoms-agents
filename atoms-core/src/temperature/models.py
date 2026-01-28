from __future__ import annotations

from datetime import datetime, timedelta, timezone
from typing import Any, Dict, List, Optional
from uuid import uuid4

from pydantic import BaseModel, Field


def _now() -> datetime:
    return datetime.now(timezone.utc)


class TemperatureFloorConfig(BaseModel):
    id: str = Field(default_factory=lambda: uuid4().hex)
    tenant_id: Optional[str] = None
    env: Optional[str] = None
    space_id: Optional[str] = None
    surface_ids: Optional[List[str]] = None
    performance_floors: Dict[str, float] = Field(default_factory=dict)
    cadence_floors: Dict[str, float] = Field(default_factory=dict)
    metadata: Dict[str, Any] = Field(default_factory=dict)
    created_at: datetime = Field(default_factory=_now)
    updated_at: datetime = Field(default_factory=_now)


class TemperatureCeilingConfig(BaseModel):
    id: str = Field(default_factory=lambda: uuid4().hex)
    tenant_id: Optional[str] = None
    env: Optional[str] = None
    space_id: Optional[str] = None
    surface_ids: Optional[List[str]] = None
    ceilings: Dict[str, float] = Field(default_factory=dict)
    metadata: Dict[str, Any] = Field(default_factory=dict)
    created_at: datetime = Field(default_factory=_now)
    updated_at: datetime = Field(default_factory=_now)


class TemperatureWeights(BaseModel):
    id: str = Field(default_factory=lambda: uuid4().hex)
    tenant_id: Optional[str] = None
    env: Optional[str] = None
    space_id: Optional[str] = None
    surface_ids: Optional[List[str]] = None
    weights: Dict[str, float] = Field(default_factory=dict)
    source: str = "system_default"
    created_at: datetime = Field(default_factory=_now)
    updated_at: datetime = Field(default_factory=_now)


class TemperatureSnapshot(BaseModel):
    id: str = Field(default_factory=lambda: uuid4().hex)
    tenant_id: str
    env: str
    space_id: str
    surface_ids: Optional[List[str]] = None
    value: float
    window_start: datetime
    window_end: datetime
    floors_breached: List[str] = Field(default_factory=list)
    ceilings_breached: List[str] = Field(default_factory=list)
    raw_metrics: Dict[str, float] = Field(default_factory=dict)
    source: str = "unknown"
    usage_window_days: int = 7
    kpi_corridors_used: List[str] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=_now)

    @staticmethod
    def default_window_end() -> datetime:
        return _now()

    @staticmethod
    def default_window_start(days: int = 7) -> datetime:
        return _now() - timedelta(days=days)
