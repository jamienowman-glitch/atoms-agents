# AgentFlow Dependency Reconnaissance Report

**Date:** 2026-01-25
**Target:** AgentFlow Orchestration & Northstar Integration
**Status:** 🟠 GAPS EXIST SEVERITY REDUCED

---

## Executive Summary
The reconnaissance of `agentflow`, `northstar-engines`, and `northstar-agents` has been updated following deep tracing of the Memory Gateway.

**Key Findings:**
1.  **Memory Architecture:** ✅ **CONFIRMED**. Whiteboard exists as a Remote Service via `MemoryGateway`. It is not a local class but an HTTP client wrapper.
2.  **Missing Intelligence:** 🔴 `ContextLens` does not exist. Agents are running blind to external signals.
3.  **Missing Eyes:** 🔴 Agents have no connection to the Human Gesture Stream (WebSocket).
4.  **Blind Handshake:** 🔴 Agents are initialized without `SurfaceConfig` or `Temperature` context.

---

## Detailed Findings

### 1. The Surface/Tenant Handshake & Temperature
*   **Target:** `northstar-engines` injects Temperature into Agent Flow context.
*   **Reality:** 🔴 **Disconnected**.
    *   **Evidence:** `northstar-agents/src/northstar/runtime/context.py` defines `AgentsRequestContext` with standard headers (`TenantId`, `ProjectId`) but **zero** mention of `Temperature`, `SurfaceConfig`, or `RiskLevel`.
    *   **Engines:** `TemperatureService` exists in `northstar-engines` and can compute a plan (`measure_temperature`), but there is no piping to pass this `TemperatureWeightsPlan` into the Agent Runner's `RunContext`.
*   **Impact:** Agents will default to a standard profile and will not react to "High Volatility" tenant states.

### 2. Memory Architecture (Whiteboard vs. Blackboard)
*   **Target:** Distinct Whiteboard (Flow-Global) and Blackboard (Node-Local).
*   **Reality:** 🟢 **CONFIRMED**.
    *   **Mechanism:** usage of `LocalBlackboard` (Python State) for Node-Local memory, and `MemoryGateway` (HTTP Client) for Flow-Global Whiteboard memory.
    *   **Evidence:** `northstar-agents/src/northstar/runtime/memory_gateway.py` implements `write_whiteboard` which posts to `/v1/memory/whiteboard/{edge_id}`.
    *   **Frontend:** `agentflow/components/workbench/ConsoleContext.tsx` listens for `whiteboard.write` SSE events and visualizes them.
    *   **Correction:** The comment "REMOVED GLOBAL STATE" in `context.py` referred to the deprecated *local* global dictionary, which has been correctly replaced by the `MemoryGateway` service.

### 3. ContextLens & Signal Ingestion
*   **Target:** Ingest external signals (Shopify, YouTube) into Agents.
*   **Reality:** 🔴 **Missing**.
    *   **Evidence:** A global search for `ContextLens` yielded **0 results** across all repositories.
    *   **Impact:** There is no mechanism to feed "Inventory Level" or "Video Performance" into the agents. They are currently isolated text processors.

### 4. Safety Enforcement Strategies
*   **Target:** Safety Strategy as Middleware or Async Agent.
*   **Reality:** 🟢 **Blocking Middleware (GateChain)**.
    *   **Evidence:** `northstar-engines/engines/nexus/hardening/gate_chain.py` implements a synchronous `run()` method.
    *   **Mechanism:** It checks `KillSwitch`, `Firearms` (Access Control), `StrategyLock`, `Budget`, `KPI`, and `Temperature` **before** executing an action.
    *   **UI Implication:** This confirms the Console should show a **Blocking Spinner** ("Safety Check...") rather than an async toast, as the request will fail `403` if safety criteria are not met.

### 5. The Token Exposure Schema
*   **Target:** `atoms-core` groups tokens by type.
*   **Reality:** 🟡 **Fragmented**.
    *   **Evidence:** `atoms-core` search yielded minimal results. However, `agentflow/lib/tokens/videoTokens.ts` **does** exist and defines clear interfaces: `VideoProjectToken`, `VideoSequenceToken`, `VideoClipToken`.
    *   **Status:** The schema exists but lives in the Consumer (`agentflow`) rather than the Core Library (`atoms-core`), potentially limiting reusability across other surfaces.

### 6. Real-Time "God View" for Agents
*   **Target:** Agents see Human Gestures (WebSocket).
*   **Reality:** 🔴 **Severed**.
    *   **Evidence:** `northstar-engines/.../ws_transport.py` successfully ingests `msg_type == "gesture"` and publishes to the `bus` and `timeline`.
    *   **Disconnect:** Use of `bus` (pub/sub) in `northstar-engines` is **not** subscribed to by `northstar-agents`. Searching `northstar-agents` for `bus` or `websocket` yielded no integration.
    *   **Impact:** Agents cannot see where the mouse is. They can only see the static state of the document when called.

### 7. The Logging Stream
*   **Target:** `console.log` SSE Stream scoped to Flow.
*   **Reality:** 🟡 **Incomplete**.
    *   **Evidence:** `northstar-agents` utilizes `StructuredLogger` which writes to `.jsonl` files. It has an `AuditEmitter` protocol.
    *   **Gap:** The `ConsoleAuditEmitter` simply prints to stdout. There is no active `StreamAuditEmitter` wired up to the `northstar-engines` SSE transport to pipe these logs back to the Browser in real-time.

---

## Recommendations
1.  **Build ContextLens Stub:** Create a basic `ContextLens` definition in `northstar-agents` to allow signal injection.
2.  **Wire Temperature:** Add `temperature_context` to the `AgentsRequestContext` headers.
3.  **Bridge the Bus:** Create a `GestureListener` in the Agent Runtime that subscribes to the Engine's `bus` for "God View" capabilities.
