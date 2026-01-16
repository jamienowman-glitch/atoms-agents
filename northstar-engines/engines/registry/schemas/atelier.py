from __future__ import annotations

from enum import Enum
from typing import Dict, List, Optional

from pydantic import BaseModel, Field


class ToolSurface(str, Enum):
    DESKTOP_RAIL = "desktop_rail"
    DESKTOP_PANEL = "desktop_panel"
    MOBILE_DOCK = "mobile_dock"
    MOBILE_DRAWER = "mobile_drawer"
    CONTEXT_LENS = "context_lens"
    DELIVERY_LENS = "delivery_lens"
    CANVAS_OVERLAY = "canvas_overlay"


class AtelierType(str, Enum):
    CANVAS = "canvas"
    ATOM = "atom"
    SURFACE = "surface"
    TOKEN_SET = "token_set"


class TokenDefinition(BaseModel):
    id: str
    type: str = Field(..., description="color | float | string")
    constraints: Dict[str, str | int | float | bool] = Field(default_factory=dict)


class AtelierManifest(BaseModel):
    id: str
    name: str
    type: AtelierType
    description: str
    capabilities: List[str] = Field(default_factory=list)
    acceptedTokens: List[str] = Field(default_factory=list)


class UIAtom(BaseModel):
    id: str
    surfaces: List[ToolSurface]
    tokens: List[TokenDefinition]
    connectors: Dict[str, str] = Field(
        default_factory=dict, 
        description='e.g., { "read": "context_lens", "write": "delivery_lens" }'
    )


class SurfaceDefinition(BaseModel):
    id: ToolSurface
    label: str
    description: Optional[str] = None
    capabilities: List[str] = Field(default_factory=list)
