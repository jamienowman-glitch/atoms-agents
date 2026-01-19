# Audit Response: Agents Repo (Northstar-Agents)

## Commentary on Reality
The "Tri-Repo Audit" accurately identifies the current gap in `northstar-agents`.
1.  **Disconnected Brain**: While we have an `EnginesBoundaryClient` that *can* listen to SSE (`canvas_commit` events exist in tests), the actual `NodeExecutor` does **not** currently use it. The Agent is "blind" to the live canvas state.
2.  **GraphLens Solution**: The **GraphLens Refactor** (specifically `TokenLens` / `TokenMapCard`) provides the exact mechanism to solve "Agent-Canvas Awareness". We can uses `TokenMap` to declare *which* parts of the Canvas State an Agent needs to see.
3.  **Event Schema Mismatch**: Our internal `AuditEvent` (`src/northstar/runtime/audit/events.py`) has `node_id` and `surface_id`, but lacks `canvasType` and `pii_stripped`. We need to harmonize this if we want to use the same envelope for internal audit and external Spine communication.

## The Repo Task Manifest: Agents

#### **REPO 2: AGENTS (THE BRAINS)**

* [ ] **Implement Spine Listener in Runtime**: Update `NodeExecutor` to initialize `EnginesBoundaryClient` and subscribe to the `canvas_stream` for the active session.
* [ ] **Harmonize Event Schema**: Update `AuditEvent` (or create `SpineEvent`) to include `canvas_type` and `pii_stripped` fields to match the Engine's Event Envelope.
* [ ] **Implement Canvas State Injection**: Create a middleware (using the new `ContextLens` or `TokenLens` logic) that injects the latest subscribed Canvas State into the Agent's system prompt (The "Real-Time Mirror").
* [ ] **Handle Spatial Updates**: Add a specific handler/token for `SPATIAL_UPDATE` events so "Layout Agents" can react to human resizing even if the text content hasn't changed.

---

# CONTEXT: Operation "Spine-Sync"

> **Mission**: We are moving from "UI Building" to **"Engine Integration"**.

You are referencing the **Event Envelope** and the **Spine**—the core orchestration layer in Engines that handles the state of the world. To make this "Real," the Agents need to see the Canvas not just as a React component, but as a **Node in the Graph**.

Here is the **Diagnostic & Strategy Prompt** for your Repo-Connected Agent. This is designed to act as a "Consultant" that audits **Engines**, **Agents**, and **AtomsFam** to find the gaps.

## 🧠 PROMPT: THE TRI-REPO INTEGRATION AUDIT (SPINE-SYNC)

**Role:** Full-Stack Systems Architect & Engine Specialist.
**Objective:** Audit the relationship between **Engines** (The Spine), **Agents** (The Brains), and **AtomsFam** (The Surface) to finalize the Real-Time Event loop.

### 🔍 THE AUDIT CHECKLIST

#### 1. The Socket/SSE Split (Protocol Audit)

* **Engines:** Identify the existing WebSocket implementation for **Chat**. Is it a dedicated `/chat` socket? Does it support multi-tenant sessions?
* **AtomsFam:** Locate where we currenty use SSE (Server-Sent Events).
* **Mission:** Confirm the logic for:
* **Chat (Websocket):** Bi-directional, sub-100ms for "Lead-the-Dance" chat.
* **Canvas State (SSE/Spine):** One-way or low-frequency updates for UI syncing.

#### 2. The Event Envelope (Spine Audit)

* **Engines:** Look for the `EventEnvelope` or `SpinePayload` schema.
* **Requirement:** Does the envelope include:
* `nodeId`: Which part of the flow are we in?
* `canvasType`: Which UI should be mounted?
* `payload`: The actual data (e.g., text, colors, video timestamps).
* `pii_stripped`: A boolean flag confirming PrivacyLens has processed the data.

#### 3. The "DOM-Unit" (Spatial Awareness)

* **AtomsFam:** Locate the prototype logic for the **DOM-Measurement Unit**.
* **Requirement:** How do we send the "Size" of an Atom back to the Agent?
* **Mission:** Ensure that when a human resizes an element on the Canvas, the **Spine** receives a `SPATIAL_UPDATE` event so the Agent knows the "Box" has changed.

#### 4. Agent-Canvas Awareness (Memory Audit)

* **Agents:** Check the current "Memory" implementation.
* **Problem:** Do the Agents see the "Canvas State" as part of their context, or is it hidden from them?
* **Mission:** Establish the "Real-Time Mirror"—where the Agent's internal representation of the blog post/video matches exactly what is rendered in the user's browser.

### 📝 REQUIRED OUTPUT: THE REPO TASK MANIFEST

After the audit, you must provide a **Markdown Table** of specific tasks per repo:

#### **REPO 1: ENGINES (THE SPINE)**

* [ ] (Example: Update `EventEnvelope.ts` to include `canvas_manifest`.)
* [ ] (Example: Finalize WebSocket route for `AgentFax` Chat.)

#### **REPO 2: AGENTS (THE BRAINS)**

* [ ] (Example: Inject `current_canvas_state` into the Agent's system prompt.)
* [ ] (Example: Add handler for `USER_UI_INTERACTION` events.)

#### **REPO 3: ATOMSFAM (THE SURFACE)**

* [ ] (Example: Wrap the Canvas in a `SpineProvider` that listens to the WebSocket.)
* [ ] (Example: Implement the DOM-Measurement hook for all Atoms.)

### 🛑 GUARDRAILS

* **NO CODE CHANGES:** This is an audit and strategy phase only.
* **FOLLOW THE SPINE:** Do not invent new communication channels. If a channel exists in the Spine, use it.
* **UI IS SECONDARY:** Treat the UI as a "Read/Write Head" for the Engine.
