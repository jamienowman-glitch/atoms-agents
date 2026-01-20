# ARCHITECTURAL MANIFEST: THE AGNOSTIC SPINE & DYNAMIC CANVAS

## 1. THE CORE PHILOSOPHY
**We do not build for specific flows. We build Capabilities.**

*   **Infrastructure is Agnostic**: The Spine (Engines) and the Surface (AgentFlow) do not know what "Lead the Dance" or "Multi-21" are. They only know Nodes, Atoms, and Events.
*   **Context is Selective**: Information (Spatial, Content, Multimodal) is strictly "Need to Know." The GraphLens determines which agent gets which token.

## 2. REPO RESPONSIBILITIES

### REPO: ENGINES (THE SPINE)
*   **The Authority**: `contracts.py` defines the `StreamEvent`. All data must fit this envelope.
*   **Isolation**: All real-time streams (WS/SSE) MUST require `project_id`. No project, no pipe.
*   **The Mirror**: Engines provide a snapshot + delta stream to allow Agents to maintain a "mental mirror" of the UI state.

### REPO: AGENTS (THE BRAINS)
*   **The Mirror**: Every agent runtime has a `canvas_mirror.py` capability. It buffers UI state but only exposes it to the agent's context if the GraphLens attaches that specific `Token`.
*   **Capability over Model**: Skills like `VisionCapable` or `SpatialAware` are modular toggles. They are not hardcoded to specific personas.

### REPO: AGENTFLOW (THE SURFACE)
*   **The Sensors**: Atoms are sensors. They report spatial moves (`SPATIAL_UPDATE`) and content changes (`ATOM_UPDATE`) only when the broadcast prop is active.
*   **Handshake**: On mount, every canvas emits a `CANVAS_READY` event containing its Tool Manifest. This tells the Agent what "buttons" it can press.

## 3. DATA FLOW PROTOCOL
*   **Transport**: WebSocket is the primary bi-directional rail. SSE is the secondary broadcast rail.
*   **Multimodal**: Media (Screenshots/Audio) is handled via Sidecars. The Event Envelope carries a reference/URL; the model fetches the blob separately.
