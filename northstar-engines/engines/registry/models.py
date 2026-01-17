from __future__ import annotations

from enum import Enum
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, ConfigDict, Field


class MaturityLevel(str, Enum):
    CONCEPT = "concept"
    DEMO = "demo"
    PRODUCTION_LITE = "production_lite"
    PRODUCTION = "production"


class RegistryEntry(BaseModel):
    """Generic registry entry for system configurations (Connectors, Firearms, etc.)."""

    id: str
    namespace: str  # e.g., "connectors", "firearms", "kpis"
    key: str        # e.g., "shopify_main", "license_kill"
    name: str       # Display Name
    config: Dict[str, Any]  # The schema-less payload
    enabled: bool = True
    tenant_id: str = "t_system"  # Defaults to God Mode
    maturity: MaturityLevel = Field(default=MaturityLevel.CONCEPT)
    next_steps: List[str] = Field(default_factory=list)

    model_config = ConfigDict(extra="ignore")
