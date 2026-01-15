Entry point is 00_CONSTITUTION.md. This file is the detailed Article 1 text.

# Constitution · Article 1 — SSE-Controlled UI

## Preamble

This document constitutes **Article 1** of the project’s Constitution, governing the fundamental architecture of user interfaces within the system. It establishes the requirement that the system is **Agent-First**: every meaningful interaction available to a human user must also be available to an automated agent.

To achieve this, Article 1 mandates that all stateful UI elements must be wired for remote control via Server-Sent Events (SSE) or an equivalent streaming mechanism. This ensures a unified state model where the UI serves as a reflection of a shared truth, modifiable by both humans and agents with equal precision.

## Core Rules

### A1.1 – Agent-First UI

Any **tool, panel, control, or stateful UI element** introduced into the system MUST expose a mechanism to be controlled by agents via SSE.

"Stateful" is defined as any element where a value or state affects the system's behavior, output, or visual presentation. This includes, but is not limited to:
*   Sliders (e.g., column counts, gaps)
*   Toggles (e.g., visibility switches)
*   Dropdowns and Selectors (e.g., view modes, variants)
*   Input fields (e.g., text content, search)
*   Interactive states (e.g., locks, expansion, focus)

If a human can change it, an agent must be able to change it.

### A1.2 – Stable Addressability

Every controllable element MUST have a **stable, unique ID (address)** that allows an agent to target it precisely.

*   **Requirement**: IDs must be deterministic and semantic. They should not rely on transient runtime values (like auto-incrementing integers that reset on reload) unless those values are stable within the session context.
*   **Examples**:
    *   `multi21.controls.colsDesktop`
    *   `multi21.controls.previewMode`
    *   `toolbar.settings.aspectRatio`
    *   `tile.{uuid}.strategyLock`

**Rule**: No anonymous magic. Every interactive component must be addressable.

> **Note on Strategy Lock & Atoms**:
> Strategy Lock, 3-Wise, and atomic targeting operate on **atoms** and **cards** identified by these IDs.
> SSE commands should always specify `surfaceId`, `atomId`, and optional `connectorName`.

### A1.3 – One-Way Stream Contract

The system must adhere to a unidirectional data flow contract for state updates:

1.  **UI → Stream**: When a human interacts with a control, the UI must emit an event to the stream channel. The payload must include:
    *   `elementId`: The stable address of the control.
    *   `value`: The new value.
    *   `source`: Identifies the origin (e.g., `human`).
    *   `timestamp`: Time of the event.

2.  **Agent → UI**: Agents DO NOT mutate the DOM or frontend state directly.
    *   An agent sends an **intent** or command to a backend handler (e.g., "set `multi21.controls.colsDesktop` to `6`").
    *   The handler processes the intent, updates the canonical state, and emits an SSE event.
    *   The UI subscribes to these events and updates its local state to match.

This ensures the UI always reflects the single source of truth.

### A1.4 – Exceptions and Scope

*   **Decorative Elements**: Purely visual or static elements (e.g., non-interactive icons, separators, background graphics, static labels) are exempt from this requirement.
*   **Scope**: This article governs **control and state**. It does not mandate that high-bandwidth data streams (like video chunks) or long-running background job logs be managed via this specific control channel, though their *configuration* (e.g., "start job", "set video quality") must be.
*   **Interactivity Threshold**: The moment an element becomes interactive (e.g., a "theme toggle" or "preset switcher"), it falls under the jurisdiction of Article 1.

### A1.5 – Planner Obligations

All **planning and architecture agents** (e.g., Architects, Gemini Planners) MUST adhere to the following when designing new features:

1.  **Explicit Compliance**: Every new UI specification or plan must explicitly state: *"All new controls in this plan will expose SSE hooks and stable IDs, per Constitution Article 1."*
2.  **SSE & Agent Control Notes**: Every plan must include a dedicated section titled `SSE & Agent Control Notes`. This section must:
    *   List the new controllable elements.
    *   Propose their stable IDs.
    *   Briefly describe the events they emit and how agents interact with them.

Failure to include this section renders a plan incomplete.

## How to Use This Document

*   **For Planners**: Reference this article in your "Goals" or "Non-Functional Requirements" section. Use the `SSE & Agent Control Notes` section to prove compliance.
*   **For Implementers**: Treat this document as a hard requirement. If a design asks for a stateful control without an ID or SSE wiring, flag it as a violation of Article 1.
*   **For Reviewers**: Reject any PR or plan that introduces "ghost state" (state accessible only to humans via mouse clicks) without a corresponding agent-accessible address.
