from __future__ import annotations
from datetime import datetime
from typing import Optional, Dict, Any, Literal
from uuid import UUID
from pydantic import BaseModel, Field

class NoteBase(BaseModel):
    type: Literal["text", "audio", "image"] = "text"
    content_text: Optional[str] = None
    content_uri: Optional[str] = None
    content_meta: Dict[str, Any] = Field(default_factory=dict)
    position: Dict[str, float] = Field(default_factory=lambda: {"x": 0, "y": 0})
    zoom: float = 1.0

class NoteCreate(NoteBase):
    pass

class NoteUpdate(BaseModel):
    type: Optional[Literal["text", "audio", "image"]] = None
    content_text: Optional[str] = None
    content_uri: Optional[str] = None
    content_meta: Optional[Dict[str, Any]] = None
    position: Optional[Dict[str, float]] = None
    zoom: Optional[float] = None
    is_archived: Optional[bool] = None

class Note(NoteBase):
    id: UUID
    tenant_id: str
    user_id: str
    space_id: Optional[str] = None
    surface_id: Optional[str] = None
    is_archived: bool = False
    created_at: datetime
    updated_at: datetime

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }
