from __future__ import annotations

import re
from datetime import datetime
from enum import Enum
from typing import Any, Dict, List, Optional, Union

from pydantic import BaseModel, Field, field_validator, model_validator


class AuthType(str, Enum):
    oauth2 = "oauth2"
    api_key = "api_key"
    basic = "basic"
    none = "none"


class RequestContext(BaseModel):
    """Canonical RequestContext from engines.common.identity."""
    request_id: str = Field(default_factory=lambda: datetime.utcnow().timestamp().__str__()) # Simplified
    tenant_id: str = Field(..., pattern=r"^t_[a-z0-9_-]+$")
    env: str
    user_id: Optional[str] = None
    
    @field_validator("env")
    @classmethod
    def validate_env(cls, v: str) -> str:
        if v not in {"dev", "staging", "prod"}:
            raise ValueError("env must be one of: dev, staging, prod")
        return v


class DatasetEvent(BaseModel):
    """Canonical DatasetEvent from engines.dataset.events.schemas (camelCase)."""
    tenantId: str = Field(..., pattern=r"^t_[a-z0-9_-]+$")
    env: str
    surface: str
    agentId: str
    input: Dict[str, Any]
    output: Dict[str, Any]
    pii_flags: Dict[str, Any] = Field(default_factory=dict)
    train_ok: bool = True
    metadata: Dict[str, Any] = Field(default_factory=dict)


class UsageEvent(BaseModel):
    """Canonical UsageEvent from engines.budget.models."""
    tenant_id: str
    env: str
    tool_type: str
    tool_id: str
    cost: str # Decimal in engine, string here for safety across boundaries? Plan said fields. 
              # engines.budget.models said Decimal. Let's strictly follow the engine if we can, or float/str. 
              # contracts typically serialize decimals to strings.
    metadata: Dict[str, Any] = Field(default_factory=dict)


class AuthField(BaseModel):
    key: str
    label: str
    secret: bool = False


class AuthScheme(BaseModel):
    type: AuthType
    fields: List[AuthField]


class OperationDatasetEvent(BaseModel):
    enabled: bool = True
    train_ok: bool = True
    pii_flags: Dict[str, Any] = Field(default_factory=dict)


class OperationUsageEvent(BaseModel):
    tool_type: str
    default_cost: str = "0.00"


class ConnectorOperation(BaseModel):
    description: str
    inputs: Dict[str, Any]  # JSON Schema
    outputs: Dict[str, Any]  # JSON Schema
    strategy_lock_action: str
    firearms_action: Optional[str] = None
    dataset_event: OperationDatasetEvent
    usage_event: OperationUsageEvent


class ConnectorTemplate(BaseModel):
    """Immutable definition of a connector's capabilities."""
    id: str = Field(..., pattern=r"^[a-z0-9_-]+$")
    version: str = Field(..., pattern=r"^[0-9]+\.[0-9]+\.[0-9]+$")
    provider: str
    auth_scheme: AuthScheme
    operations: Dict[str, ConnectorOperation]


class TemplateRef(BaseModel):
    id: str
    version: str


class InstanceStatus(str, Enum):
    active = "active"
    error = "error"
    degraded = "degraded"


class ConnectorInstance(BaseModel):
    """Runtime instantiation of a template for a specific tenant/env."""
    id: str
    tenant_id: str = Field(..., pattern=r"^t_[a-z0-9_-]+$")
    env: str
    template_ref: TemplateRef
    config: Dict[str, Any] = Field(default_factory=dict)
    enabled: bool = True
    status: InstanceStatus = InstanceStatus.active
    revision: int = 1
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    @field_validator("env")
    @classmethod
    def validate_env(cls, v: str) -> str:
        if v not in {"dev", "staging", "prod"}:
            raise ValueError("env must be one of: dev, staging, prod")
        return v

    @classmethod
    def validate_config_secrets(cls, config: Dict[str, Any], template: ConnectorTemplate) -> None:
        """
        Validates that any field marked as secret in the template 
        is stored as a GSM reference (starts with 'secret::').
        """
        # Build map of secret fields
        secret_keys = {
            f.key for f in template.auth_scheme.fields 
            if f.secret
        }
        
        # Check config values
        # We assume 'config' holds both auth values and other settings. 
        # If structure is config['auth'] vs config['settings'], adjust here.
        # Based on schema: config can be flat or nested. 
        # The plan had config->auth and config->settings. 
        # Let's assume input config is the fully flattened combined or the 'auth' block specifically?
        # Re-reading PHASE_01_SCHEMAS: 
        # properties: 
        #   config:
        #     auth: ...
        #     settings: ...
        
        # Let's support the structure: config = {"auth": {...}, "settings": {...}}
        auth_config = config.get("auth", {})
        
        for key, value in auth_config.items():
            if key in secret_keys:
                if not isinstance(value, str) or not value.startswith("secret::"):
                    raise ValueError(f"Field '{key}' is a secret and MUST start with 'secret::'")
