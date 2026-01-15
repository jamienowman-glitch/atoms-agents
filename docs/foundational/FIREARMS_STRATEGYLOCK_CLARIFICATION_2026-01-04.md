# Firearms vs Strategy Lock Clarification
**Date**: 2026-01-04
**Status**: Active / Authoritative

This document clarifies the distinct roles and enforcement mechanisms of "Firearms" and "Strategy Lock" in the Northstar platform. It supersedes previous understandings where the two might have been conflated.

## 1. Core Distinction

| Feature | Role | Question | Enforcement | Source of Truth |
| :--- | :--- | :--- | :--- | :--- |
| **Firearms** | **Permission Gate** | "WHO may do this at all?" | **Always** | Grant Store (Agent/User License) |
| **Strategy Lock** | **Approval Gate** | "DO we require approval?" | **Configurable** | System/Tenant/Node Config |

### Key Rules
1.  **Firearms are Absolute**: If an agent lacks the required firearm grant for an action, it is a **Permission Failure** (403). It is not "blocked by config"; it is simply unauthorized usage of a capability.
2.  **Strategy Lock is Workflow**: Strategy Lock is a pause button for human review. It can be turned on/off by policy.
3.  **Independence**: Turning off Strategy Lock **does NOT** bypass Firearms checks.
4.  **No "Blocked" State**: Actions are either Allowed, Denied (Permission), Required Approval, or Error. We do not support a "Blocked" config state; unwanted actions should be removed from the graph/tools instead.

## 2. Default Linkage (Convenience Only)
At system onboarding (`T_system`), we may apply a default policy:
*   *If [Action X] requires [Firearm Y] -> Default Strategy Lock Required = TRUE*

This is a **default** that can be overridden by Enterprise tenants (e.g., they may trust an agent with a firearm to act autonomously without lock).

## 3. Enforcement Logic (Waterfall)

Enforcement occurs at the `GateChain` choke point in this strict order:

1.  **Identity Precedence**: (Server-derived identity check)
2.  **Tenant Membership**: (Is the user/agent in the tenant?)
3.  **Firearms Permission**: (Does actor have the grant?) -> **DENY (403)** if missing.
4.  **Strategy Lock**: (Is lock required by config?) -> **REQUIRES_APPROVAL (409/403)** if required & not satisfied.
5.  **Policy Gates**: (Budget, KPI, Temperature, etc.)

## 4. Error Contract

### Firearms Missing Grant
*   **HTTP Status**: `403 Forbidden`
*   **Error Code**: `firearms.missing_grant`
*   **Details**:
    *   `required_license_types`: List[str] (e.g. `['firearm.database_write']`)
    *   `action_name`: str
    *   `subject_type`: str
    *   `subject_id`: str

### Strategy Lock Required
*   **HTTP Status**: `403 Forbidden` (Global decision: 403 for policy blocks)
*   **Error Code**: `strategy_lock.required`
*   **Details**:
    *   `lock_scope`: dict (Scope info)
    *   `lock_id`: str (Optional, if created/suggested)
    *   `action`: str

### Missing Infrastructure
*   **HTTP Status**: `503 Service Unavailable`
*   **Error Code**: `<resource_kind>.missing_route`

## 5. Configuration Scopes
*   **System**: Global defaults.
*   **Tenant**: Organization-wide policy overrides.
*   **Surface**: App/Interface specific overrides.
*   **Node**: Granular overrides for specific graph nodes (e.g. "This specific SQL node requires approval, others don't").
