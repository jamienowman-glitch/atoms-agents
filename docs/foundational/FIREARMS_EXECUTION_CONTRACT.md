# Firearms Execution Contract

**Date**: 2026-01-04
**Status**: Active / Authoritative

This document defines the contract for "Firearms" capability enforcement across the Northstar platform. It supersedes previous versions to strictly separate "Permission" (Firearms) from "Workflow Approval" (Strategy Lock).

## 1. Core Principle: "Permission Gate"
Firearms answer the question: **"WHO may do this at all?"**

- **Firearm**: An explicit capability/license (e.g., `firearm.database_write`, `firearm.publish_web`) representing permission to perform high-stakes actions.
- **Firearm Grant**: The assignment of a Firearm to a specific actor (Agent, User) within a Tenant.
- **Enforcement**: **Always Enforced**. If an agent lacks the required license, it is a PERMISSION FAILURE. It cannot be bypassed by configuration.

## 2. Enforcement Logic (GateChain)
When an action is requested (Tool, Canvas Command, etc.), Engines enforces checks in this strict order:

1.  **Identity Precedence**: Server-derived identity.
2.  **Tenant Membership**: Is user/agent in tenant?
3.  **Firearms Permission Gate**:
    - **Binding Check**: Is action bound to a Firearm?
    - **Grant Check**: If bound, does actor have the specific Firearm Grant?
        - If NO -> **BLOCK (403 `firearms.missing_grant`)**.
        - If YES -> Proceed.
4.  **Strategy Lock Gate**:
    - Is Strategy Lock required by Config (System/Tenant/Node)?
        - Note: Systems may default "Firearm Actions" to "Lock Required", but this is overridable.
    - If Required & Not Satisfied -> **BLOCK (403 `strategy_lock.required`)**.
5.  **Policy Gates**: (Budget, KPI, etc.)

## 3. Error Contract (HTTP 403)

### Missing Firearms Grant
*   **HTTP Status**: `403 Forbidden`
*   **Error Code**: `firearms.missing_grant`
*   **Details**:
    *   `required_license_types`: List[str] (e.g. `['firearm.database_write']`)
    *   `action_name`: str
    *   `subject_type`: str
    *   `subject_id`: str
    *   `message`: "Firearm license required for this action"

## 4. Agents' Role
Agents are consumers of this contract.
- Agents CANNOT self-grant firearms.
- Agents MUST inspect `northstar-agents/src/northstar/registry/firearms` (conceptually) to know what exists.
- Agents MUST handle `403 firearms.missing_grant` errors gracefully (STOP, do not retry).

## 5. API Surface (Engines)
- **Registry**: `POST /firearms/`, `GET /firearms/`
- **Bindings**: `POST /firearms/bindings`, `GET /firearms/bindings`
- **Grants**: `POST /firearms/grants`, `GET /firearms/grants`
