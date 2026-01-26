# Tech Spec: Unified Realtime Harness & Chat Rail

## 1. Objective
Establish a **Self-Contained Realtime Harness** within `atoms-ui`. This removes the dependency on `agentflow` for transport and ensures that any Canvas built here automatically inherits:
1.  **Realtime Transport** (SSE + WebSocket).
2.  **Chat Rail** (Agent Communication).
3.  **Multimodal Support** (Visual Snapshots / Drag & Drop).

## 2. Architecture
The `atoms-ui` repo will now host its own "Spine" to connect to the backend `northstar-engines`.

### A. The Transport Layer (`harness/transport`)
We will lift the `CanvasTransport` class.
-   **Dual-Channel**:
    -   **SSE**: Downstream Truth (State Patches, Chat Streams, Logs).
    -   **WebSocket**: Upstream Ephemeral (Cursors, Presence).
    -   **HTTP**: Upstream Durable (Commands, File Uploads).
-   **Context**: Enforces `TenantId`, `ProjectId`, `UserId` headers.
-   **Safety**: Respects `GateChain` policies (handled by backend 403s).

### B. The Harness Integration
The `ToolControlContext` will become `HarnessContext` (or extend it).
-   **Initialization**: On mount, it instantiates `CanvasTransport` using `window.location` derived context (or props).
-   **Command Loop**: `transport.sendCommand` is exposed to all Canvases.
-   **State Sync**: The Harness listens to `op_committed` and `patch` events to update its internal `ToolState`.

### C. The Chat Rail
A standard UI component living in the Harness (`ChatRail.tsx`).
-   **Mode**: Nano (Bar) -> Micro (Chat) -> Standard (History) -> Full (Focus).
-   **Stream**: Listens to `chat_message` events from SSE.
-   **Input**: Sends messages via `transport.postMessage`.
-   **Multimodal**: Handles Image Pasting -> `transport.uploadArtifact` -> Sends URI to Agent.

## 3. Implementation Details

### Directory Structure
```text
atoms-ui/
├── harness/
│   ├── transport/
│   │   ├── index.ts           # The CanvasTransport Class (Lifted)
│   │   └── contracts.ts       # The Types (Lifted)
│   ├── context/
│   │   └── ToolControlContext.tsx # Updated to use Transport
│   └── components/
│       └── ChatRail.tsx       # The Chat UI
```

### Multimodal Protocol
1.  **User Paste/Drop**: UI captures `File`.
2.  **Upload**: `transport.uploadArtifact(file)`.
3.  **Response**: Backend returns `{ uri: "gs://...", mime: "image/png" }`.
4.  **Send**: Chat Rail sends message with `attachments: [{ uri }]`.
5.  **Agent**: Receives URI, uses `VisionCapable` scope to see it.

## 4. Why This Works
-   **Decoupling**: `atoms-ui` no longer needs `agentflow` source code to run.
-   **Standardization**: Every new Canvas gets Chat + Realtime for free.
-   **Compliance**: Enforces the `northstar-engines` protocol (Headers, GateChain) at the root level.
