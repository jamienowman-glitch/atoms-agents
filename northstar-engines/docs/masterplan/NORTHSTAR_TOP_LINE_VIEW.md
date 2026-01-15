# Northstar: The Verified Architecture (Top Line View)

**Status**: Verified Reality
**Date**: Jan 12, 2026

This document maps the **Verified Reality** of the Northstar System. It serves as the index for the detailed inspection reports created during the "Deep Reckoning."

---

## 1. The Core Infrastructure (Engines)
A centralized Control Plane & Data Plane.

*   **Hierarchy & Tenancy**: `t_tenant` / `env` / `surface` / `project`.
    *   📄 [Read Report: Hierarchy & Reality](NORTHSTAR_ENGINES_REALITY_HIERARCHY.md)
*   **Safety & Gates**: The "Gate Chain" (Kill Switch, Budget, Firearms).
    *   📄 [Read Report: Safety Architecture](NORTHSTAR_SAFETY_ARCHITECTURE.md)
*   **Logging & Telemetry**: The "Event Spine" (Audit, Debug, Billing).
    *   📄 [Read Report: Logging Integration Spec](NORTHSTAR_LOGGING_REALITY_AND_INTEGRATION_SPEC.md)
*   **Cloud Infrastructure**: Routing for S3, GCS, Azure, DynamoDB.
    *   📄 [Read Report: Cloud Infra Reality](NORTHSTAR_CLOUD_INFRASTRUCTURE.md)
    *   ⚠️ **Gap**: [Routing Surface Refactor Plan](ROUTING_SURFACE_REFACTOR_PLAN.md) (Need to scope infra per-surface).

## 2. Realtime & Communication
How data moves instantly between Agents, UI, and System.

*   **The Timeline**: The "One Truth" sorted event stream.
    *   📄 [Read Report: Realtime Architecture](NORTHSTAR_REALTIME_ARCHITECTURE.md)
*   **Canvas Sync**: The "Piggyback" mechanism on Chat Bus.
    *   📄 [Read Report: Canvas Realtime](NORTHSTAR_CANVAS_REALTIME.md)

## 3. The Agents (Atomic Framework)
The composition of specialized intelligences.

*   **Data Model**: Personas, Tasks, Capabilities, Artifacts.
    *   📄 [Read Report: Data Model Map](NORTHSTAR_DATA_MODEL_MAP.md)
*   **Atomic Composition**: Validating strict separation of concerns.
    *   📄 [Read Report: Atomic Agency](ATOMIC_AGENCY_REPORT.md)
*   **Frameworks & Teams**: Nesting logic and gaps.
    *   📄 [Read Report: Atomic Framework Gap](ATOMIC_FRAMEWORK_GAP_REPORT.md) (Missing Role Mapping).

## 4. The Muscle (Specialized Engines)
The heavy lifting capabilities.

*   **Audio/Video/CAD**: Inventory of what exists and what is missing.
    *   📄 [Read Report: Muscle Inventory & Gaps](MUSCLE_INVENTORY_AND_GAPS.md)

## 5. The Issues
*   **Central Log**: Detailed list of conflicts, missing folders, and risks.
    *   📄 [Read Log: Issues & Gaps](issues.md)
    *   📄 [Read Log: Conflicts & Drift](CONFLICTS_AND_DRIFT_LOG.md)

---
**Next Step**: [The Execution Masterplan](NORTHSTAR_EXECUTION_MASTERPLAN.md)
