"""Guard to prevent accidental Vertex usage unless explicitly allowed."""

from __future__ import annotations

import os

ALLOW_BILLABLE_VERTEX_ENV = "ALLOW_BILLABLE_VERTEX"
_DOCUMENTATION_PATH = "docs/infra/COST_KILL_SWITCH.md"


def allow_billable_vertex() -> bool:
    """Return True when Vertex billing is explicitly allowed."""
    value = os.getenv(ALLOW_BILLABLE_VERTEX_ENV, "").strip().lower()
    return value in {"1", "true", "yes", "on"}


def ensure_billable_vertex_allowed(feature: str) -> None:
    """Raise when billing is denied and refer to the documentation."""
    if allow_billable_vertex():
        return
    raise RuntimeError(
        f"{feature} requires {ALLOW_BILLABLE_VERTEX_ENV}=1 to proceed (see {_DOCUMENTATION_PATH} for context)."
    )


def verify_vertex_budget(tenant_id: str, env: str) -> None:
    """
    Strict check for Vertex budget. Raises runtime error if not allowed.
    Allowed if global ALLOW_BILLABLE_VERTEX is set OR tenant is in HIGH_BUDGET_TENANTS.
    """
    if allow_billable_vertex():
        return

    # Check per-tenant override (High Budget Flag)
    # Config is injected via environment variable as comma-separated list
    high_budget_tenants = [t.strip() for t in os.getenv("HIGH_BUDGET_TENANTS", "").split(",")]
    if tenant_id in high_budget_tenants:
        return

    raise RuntimeError(f"Vertex billing denied for {tenant_id}/{env} (Cost Kill Switch Active)")
