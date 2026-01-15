# Strategy Lock Execution Contract

**Date**: 2026-01-04
**Status**: Active / Authoritative

This document defines the contract for "Strategy Lock" enforcement across the Northstar platform.

## 1. Core Principle: "Approval Gate"
Strategy Lock answers the question: **"DO we require approval before execution?"**

- **Purpose**: A pause button for human review/control.
- **Scope**: Can be enabled/disabled at System, Tenant, Surface, or Node level.
- **Independence**: Turning OFF Strategy Lock does **NOT** bypass Firearms permission checks.
- **No "Blocked" Config**: Actions are either Allowed, Denied (Permission), or Require Approval. We do not use Config to permanently "Block" actions (remove them from graph instead).

## 2. Enforcement Logic
Engines determines if a lock is required by resolving configuration (Waterfall):

1.  **Node Scope**: `overrides.nodes.{node_id}`
2.  **Graph/Canvas Scope**: `overrides.graphs.{graph_id}`
3.  **Surface Scope**: `overrides.surfaces.{surface_id}`
4.  **Tenant Default**: `defaults.require_for_tools`, `defaults.require_for_canvas`
5.  **System Default**: (May default to "True" for firearm-bound actions, but overridable).

If **Required**, Engines checks for an **Active, Approved Strategy Lock** matching the scope.
If not found/approved -> **BLOCK**.

## 3. Error Contract (HTTP 403)

### Strategy Lock Required
*   **HTTP Status**: `403 Forbidden`
*   **Error Code**: `strategy_lock.required`
*   **Details**:
    *   `lock_scope`: dict (Scope info)
    *   `action`: str
    *   `lock_id`: str (Optional, if created/suggested)
    *   `message`: "Strategy lock required before execution"

**Agents Behavior**:
- MUST catch `403 strategy_lock.required`.
- MUST NOT retry immediately.
- MUST report "Approval Required" state to UI/User.

## 4. Chat Integration (Concept)
Chat clients (UI) will not execute tools directly. Instead, when a user intention requires a lock (e.g., "Deploy to Prod"), the Chat system will:

1.  Call `POST /strategy-locks/prepare` with the intent and scope.
2.  Receive a `PENDING` lock object.
3.  Render a "Lock Request" card to the user.
4.  User approves the lock (via 3-Wise or Admin flow).
5.  Lock becomes `APPROVED`.
6.  Chat retries the execution, which now passes GateChain.

## 5. Configuration API (Admin/System)
- **Get Config**: `GET /config/strategy-lock`
- **Update Config**: `PUT /config/strategy-lock`
