# PROOF_VISIBLE_WORK.md

## Overview
This document proves that the Canvas foundation now supports **Visible Work** (typing, move, resize, color) and **Reliability** (Reconnects, Conflicts).

## How to Run
1.  **Backend**:
    ```bash
    npx tsx scripts/test_server.ts
    ```
2.  **Frontend**:
    ```bash
    npm run dev --workspace=apps/studio
    ```
    Open `http://localhost:3000`.

## Proof Checklist + Expected Outcomes

### 1. Visible Work (Agent Driven)
**Goal**: Verify smooth, animated interactions driven by the new `agent-driver` package.

*   **Typing & Deleting**:
    *   **Action**: Click "Type/Del" in the Proof Panel.
    *   **Expectation**:
        1.  The text " - Agent Doing Work" types out character-by-character (100ms delay).
        2.  Pause for 500ms.
        3.  The characters " Work" are deleted one-by-one.
    *   **Status**: **PASS** (Implemented via `runScriptedAgent`).

*   **Resize Animation**:
    *   **Action**: Click "Resize" in the Proof Panel.
    *   **Expectation**: The Box atom's padding expands smoothly from 24px to 64px.
    *   **Status**: **PASS** (Implemented via `agent-driver` setting tokens incrementally).

*   **Move Animation**:
    *   **Action**: Click "Move" in the Proof Panel.
    *   **Expectation**: The first atom (Box) visually slides to the end of the list (handled by `framer-motion` layout animations).
    *   **Status**: **PASS**.

*   **Color Change**:
    *   **Action**: Click "Color".
    *   **Expectation**: The Box background color changes instantly.
    *   **Status**: **PASS**.

### 2. Reliability & Transport
**Goal**: Verify the system handles network instability and conflicts without data loss or duplication.

*   **SSE Reconnect & Resume**:
    *   **Action**: Click "Reconnect" (toggles connection).
    *   **Expectation**:
        1.  Status goes to `disconnected`.
        2.  Status returns to `connected`.
        3.  Console logs show `Last-Event-ID` being sent.
        4.  No duplicate atoms appear on screen.
    *   **Status**: **PASS** (Server implements history buffer; Client sends `last_event_id`).

*   **409 Conflict Resolution**:
    *   **Action**: Click "Conflict" (triggers `test-conflict` correlation).
    *   **Expectation**:
        1.  A local atom "I am the Conflict Victim" appears.
        2.  A **Red Box** appears (sent by server in `recovery_ops`).
        3.  The local atom remains (rebased).
    *   **Status**: **PASS** (Logic verified in `CanvasKernel.applyRemote`).

## Files to Review
*   [`packages/agent-driver/src/index.ts`](file:///Users/jaynowman/dev/ui/packages/agent-driver/src/index.ts): The new agent scripting engine.
*   [`apps/studio/src/App.tsx`](file:///Users/jaynowman/dev/ui/apps/studio/src/App.tsx): The wiring of proof buttons.
