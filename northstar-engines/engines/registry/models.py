from __future__ import annotations

from typing import Any, Dict, Optional

from pydantic import BaseModel, ConfigDict, Field


class RegistryEntry(BaseModel):
    """Generic registry entry for system configurations (Connectors, Firearms, etc.)."""

    id: str
    namespace: str  # e.g., "connectors", "firearms", "kpis"
    key: str        # e.g., "shopify_main", "license_kill"
    name: str       # Display Name
    config: Dict[str, Any]  # The schema-less payload
    enabled: bool = True
    tenant_id: str = "t_system"  # Defaults to God Mode

    model_config = ConfigDict(extra="ignore")
