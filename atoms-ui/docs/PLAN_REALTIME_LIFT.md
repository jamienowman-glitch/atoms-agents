# Atomic Plan: Realtime Lift

**Objective**: Lift Transport & Chat Rail into `atoms-ui`.

## Phase 1: The Foundation (Transport)
- [ ] **Create `harness/transport/contracts.ts`**:
    -   Copy strict types from `agentflow`.
    -   Ensure `Command`, `StreamEvent`, `MediaSidecar` are defined.
- [ ] **Create `harness/transport/index.ts`**:
    -   Copy `CanvasTransport` logic.
    -   Ensure `connect`, `sendCommand`, `uploadArtifact` are implemented.

## Phase 2: The Harness Wiring
- [ ] **Update `harness/context/ToolControlContext.tsx`**:
    -   Add `transport` to Context value.
    -   Initialize transport on mount (mock config for now, or env vars).
    -   Replace local state mutation with `transport.sendCommand` (or dual-write for optimistic UI).

## Phase 3: The Chat Rail
- [ ] **Create `harness/components/ChatRail.tsx`**:
    -   Implement the Shell (Nano/Micro modes).
    -   Wire Input to `transport.postMessage`.
    -   Wire Stream to `transport.onEvent('chat')`.

## Phase 4: Multimodal & Verification
- [ ] **Verify**:
    -   Check that `transport` compiles without `agentflow` imports.
    -   Check that `ChatRail` renders.
    -   (Manual) Verify uploads would call the correct endpoint.
