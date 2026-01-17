# Northstar Blackboard Audit

**Date:** 2025-12-27
**Scope:** Static Analysis of `northstar-agents` repo
**Auditor:** Oracle (Recon)

## 0. Executive Summary

In the `northstar-agents` repository, "Blackboard" refers to **two distinct but related state mechanisms**:

1.  **The "Core" Blackboard (Framework Level)**
    *   **Definition:** A persistent, class-based Key-Value store defined in `src/northstar/core/blackboard/blackboard.py`.
    *   **Scope:** Per-Session / Per-CLI-Command. Managed by `PersistenceFactory`.
    *   **Persistence:** JSON file (`local` backend) stored in a temporary session directory.
    *   **Consumers:** Framework Adapters (via `RunContext`) and CLI commands.

2.  **The "Flow" Blackboard (Node Level)**
    *   **Definition:** A transient, in-memory Python `dict` (`Dict[str, Any]`).
    *   **Scope:** Per-Flow-Run. Created freshly empty in `FlowExecutor.execute_flow`.
    *   **Persistence:** None (Ephemeral).
    *   **Consumers:** Native Northstar Nodes (Agents) running within `FlowExecutor`.

**Critical Finding:** There is a **contract mismatch** between the two. `NodeExecutor` expects a `dict` (uses `__setitem__`), while `RunContext` provides a `Blackboard` object (uses `.set()`). This implies Native Flows and Framework Adapters use incompatible state containers currently.

## 1. Canonical Definitions

### Core Blackboard (Class)
*   **Definition:** `src/northstar/core/blackboard/blackboard.py` defines the abstract base `Blackboard`.
*   **Implementation:** `src/northstar/core/blackboard/local.py` defines `LocalBlackboard`.
*   **Configuration:** Controlled by `profile.blackboard_backend` (values: `local` | `infra`) in `src/northstar/registry/schemas/profiles.py`.

### Flow Blackboard (Dict)
*   **Definition:** Implicitly defined as `blackboard: Dict[str, Any] = {}` in `src/northstar/runtime/executor.py`.
*   **Usage:** Passed to `NodeExecutor.execute_node` as a required argument.

## 2. Read/Write Contract

### Core Blackboard (Class)
**Public API:**
*   `get(key: str) -> Optional[Any]`
*   `set(key: str, value: Any) -> None`
*   `delete(key: str) -> None`
*   `list_keys() -> List[str]`

**Constraints:**
*   **Keys:** Must be strings.
*   **Values:** `Any` (must be JSON-serializable for `LocalBlackboard`).
*   **Metadata:** No attribution (who modified it), timestamps, or versioning are tracked internally.

### Flow Blackboard (Dict)
**Public API:**
*   Standard Python Dict methods (`__getitem__`, `__setitem__`).
*   `NodeExecutor` explicitly writes to it: `blackboard[key] = writes[key]`.

**Constraints:**
*   **Schema:** Defined declaratively in `NodeCard` fields:
    *   `blackboard_writes: List[str]`
    *   `blackboard_reads: List[str]`
    *   (See `src/northstar/registry/schemas/nodes.py`)

## 3. Scoping Model

*   **Per-Flow-Run (Native):**
    *   The `FlowExecutor` instantiates a **fresh, empty** `dict` for every call to `execute_flow`.
    *   **Isolation:** Totally isolated. Changes in one run do not affect others.
    *   **Discovery:** Passed explicitly down the stack: `FlowExecutor` -> `NodeExecutor` -> `compose_messages`.

*   **Per-Session (Frameworks/CLI):**
    *   `PersistenceFactory.get_blackboard` creates a scoped instance rooted in `tmpdir/blackboard`.
    *   Used by `verify_modes` (`cli/commands.py`).
    *   **Shared State:** Multiple framework modes running in the same `RunContext` (if that were supported) would share this instance.

**Can multiple frameworks write to the same artifact?**
Yes, if they share the `RunContext`. The `LocalBlackboard` would persist their writes to the same JSON file.

## 4. Events/Logging Integration

*   **Blackboard Internal Logging:**
    *   **No.** `LocalBlackboard` does *not* emit telemetry events on `get`/`set`.
    *   It prints error strings to stdout on JSON save/load failures.

*   **Usage Logging (Audit Trail):**
    *   **Yes (Partially).** `NodeExecutor` emits `node_end` audit events.
    *   **Payload:** Includes `blackboard_writes` (a dict of keys written and their values/summaries).
    *   **Gap:** Reads are not logged as events, though `nexus_retrieval` events serve a similar "context read" tracking purpose.

## 5. Safety + Privacy Boundaries

*   **PII/Redaction:**
    *   **None.** `LocalBlackboard` stores data exactly as received.
    *   `PIIStrategy` exists in `RunContext` but is **not invoked** by the Blackboard methods.
    *   **Risk:** Values written to the blackboard are serialized to disk in cleartext.

*   **Model Safety:**
    *   `compose_messages` in `src/northstar/runtime/prompting/composer.py` blindly dumps `inputs` (the blackboard subset) into the User Message as `json.dumps(inputs)`.
    *   **No filtering** prevents sensitive fields from being sent to the LLM if they are in the `blackboard_reads` list.

## 6. Integration Risk Notes (Do-not-break contracts)

*   **The Incompatibility Trap:** Do not pass a `Blackboard` class instance to `NodeExecutor`. It will crash when the executor tries to use `[]` syntax.
*   **Serialization:** `LocalBlackboard` assumes values are JSON-serializable. Storing complex objects (like `NodeCard` or custom classes) will cause save failures.
*   **Race Conditions:** `LocalBlackboard` reads/writes the entire JSON file on every `set`/`delete`. High-frequency writes or concurrent framework usage on the same file will have race conditions.
*   **Key Collisions:** The namespace is global (flat KV). Frameworks must prefix keys (e.g., `autogen.state`) to avoid collisions.

## 7. Evidence Index

*   `src/northstar/core/blackboard/blackboard.py`: Abstract Base Class definition.
*   `src/northstar/core/blackboard/local.py`: JSON-backed implementation (`LocalBlackboard`).
*   `src/northstar/runtime/profiles.py`: `PersistenceFactory` logic (`get_blackboard`).
*   `src/northstar/runtime/executor.py`: `FlowExecutor` logic (in-memory `dict` creation).
*   `src/northstar/runtime/node_executor.py`: `execute_node` logic (usage of `blackboard[key]`).
*   `src/northstar/registry/schemas/nodes.py`: Schema for `blackboard_reads`/`writes`.
