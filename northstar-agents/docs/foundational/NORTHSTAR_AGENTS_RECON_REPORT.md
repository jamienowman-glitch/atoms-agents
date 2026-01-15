# Northstar Agents Recon Report

**Date:** 2025-12-28
**Scope:** `northstar-agents` repo (Static Analysis)
**Agent:** Oracle (Recon)

## A) Blackboard & Scoping

**1. The "Two Blackboards" Problem**
There is a fundamental schism in how state is handled, creating a compatibility trap.

*   **Core Blackboard (Class-based)**
    *   **Definition:** `src/northstar/core/blackboard/local.py` (`LocalBlackboard`).
    *   **Scope:** Per-Session or Per-CLI-Command.
    *   **Persistence:** JSON file on disk.
    *   **API:** `.get()`, `.set()`, `.delete()`.
    *   **Consumer:** Framework Adapters (via `RunContext`).

*   **Flow Blackboard (Dict-based)**
    *   **Definition:** Plain `Dict[str, Any]` created in `FlowExecutor` (`src/northstar/runtime/executor.py:52`).
    *   **Scope:** Per-Flow-Run (Ephemeral).
    *   **Persistence:** None (Lost after run).
    *   **API:** `__getitem__`, `__setitem__`.
    *   **Consumer:** Native Nodes (via `NodeExecutor.execute_node`).

**Risk:** Passing a `Core Blackboard` to a Native Node will crash the system (Node expects `dict`). Native nodes currently have **no persistence** across runs.

## B) Logging & Events

**1. What is Logged (Audit Trail)**
*   `NODE_START`: Emitted at start of `execute_node`.
*   `NODE_END`: Emitted on success (includes `duration_ms`).
*   `ERROR`: Emitted on exception.
*   **Evidence:** `src/northstar/runtime/node_executor.py:34,169,189`.

**2. Missing Events (Internal only)**
The following are captured in the return object but **NOT emitted** to the persistent audit stream:
*   `nexus_retrieval`: Appended to local list (`node_executor.py:109`).
*   `invocation_start` / `invocation_end`: Appended locally (`node_executor.py:129,138`).
*   `readiness_check`: Appended locally (`node_executor.py:97`).
*   **Implplication:** You cannot debug LLM usage or retrieval quality from the audit logs alone.

**3. The "Orphaned Run" Defect**
*   `FlowExecutor` runs a flow but does not pass a Run ID to nodes.
*   `NodeExecutor` generates a **new random UUID** for `run_id` every time it runs a node (`node_executor.py:31`).
*   **Result:** Every node execution looks like a separate, unrelated run in the logs. There is no `trace_id` or `flow_run_id` connecting them.

## C) PII & Safety Risks

**1. Unused PII Strategy**
*   `PIIStrategy` is defined and loaded in `RunContext` (`runtime/context.py:22`) but **never referenced** in `NodeExecutor`.
*   **Evidence:** grep and reading `node_executor.py` shows zero calls to `.redact()` or `.reinsert()`.

**2. Prompt Leakage Risk**
*   `compose_messages` blindly receives `blackboard` (or inputs) and calls `json.dumps(inputs)` into the user message (`runtime/prompting/composer.py:39`).
*   **Risk:** Any PII or secrets written to the blackboard are sent in cleartext to the Model.

## D) Identity Map

| ID Type | Status | Source / Evidence |
| :--- | :--- | :--- |
| `tenant_id` | **Exists** | `TenantCard` (`schemas/tenancy.py`), `RunContext` overlay. |
| `run_id` | **Broken** | Generated per-node (`node_executor.py:31`), no parent context. |
| `node_id` | **Exists** | `NodeCard.node_id`. |
| `agent_id` | **Missing** | implied by `node_id` but no distinct `agent_id` passed to runtime. |
| `session_id` | **Missing** | Not present in Executor or Context. |
| `request_id` | **Missing** | Not present. |
| `user_id` | **Partial** | `actor` field in `AuditEvent`, but not systematically propagated. |
| `project_id`| **Env** | `GCP_PROJECT_ID` usage in Model Cards. |

## E) Integration Contract (Engines -> Agents)

To integrate `northstar-engines` safely, the following adapters are required:

1.  **State Adapter:** Must convert `northstar-engines` persistent state into a `Dict` for Native Nodes, or update `NodeExecutor` to accept an abstract Protocol.
2.  **Identity Injector:** Must inject a stable `run_id` (Trace ID) into `NodeExecutor` so node logs can be correlated.
3.  **PII Middleware:** Must wrap `compose_messages` or `NodeExecutor` to enforce PII redaction before `json.dumps`.
4.  **Logging Sink:** Must implement `AuditEmitter` to route events to `northstar-engines` storage (e.g. BigQuery/Postgres) instead of just JSONL.

## Evidence Index

*   `src/northstar/runtime/node_executor.py`: [Lines 31 (UUID gen), 34 (Emit Start), 109 (Swallowed Event), 164 (Dict write)]
*   `src/northstar/runtime/executor.py`: [Line 52 (Dict creation)]
*   `src/northstar/core/blackboard/local.py`: [Whole file (Class-based implementation)]
*   `src/northstar/runtime/prompting/composer.py`: [Line 39 (Unsafe JSON dump)]
*   `src/northstar/runtime/audit/events.py`: [Event Definitions]
