# Demo Steps: Verifying Visible Work & Reliability

Use the **Studio Proof Panel** (bottom-right) to verify requirements.

## 1. Setup
Runs locally on ports 3000 (UI) and 8000 (API).
```bash
# Terminal 1: Backend
npx tsx scripts/test_server.ts

# Terminal 2: UI
npm run dev --workspace=apps/studio
```
Open [http://localhost:3000](http://localhost:3000).

## 2. Verify Visible Work

### A. Typing & Deleting (Agent Simulation)
1.  **Click `+ Text`**. A text box appears.
2.  **Click `Type/Del`**.
    *   **Observe**: The cursorless text updates character-by-character: ` ` -> ` -` -> ` - A` -> ... ` - Agent Doing Work`.
    *   **Observe**: It pauses, then deletes the word "Work" one-by-one.
    *   *Result*: Text should read "Hello World - Agent Doing".

### B. Smooth Moves
1.  **Click `+ Box`**. A box appears.
2.  **Click `Move`**.
    *   **Observe**: The first atom in the list slides visually to the bottom position (no teleport).
    *   *Note*: Uses `framer-motion` layout animations.

### C. Resize Animation
1.  **Click `Resize`**.
    *   **Observe**: The Box's padding expands smoothly from `24px` to `64px`.

### D. Live Color
1.  **Click `Color`**.
    *   **Observe**: The Box background color changes instantly.

## 3. Verify Reliability

### A. 409 Conflict Recovery
1.  **Click `Conflict`**.
    *   **Observe**:
        1.  A local atom "I am the Conflict Victim" appears immediately (Optimistic).
        2.  Moments later, a **Red Box** appears at the top (Server Recovery).
        3.  The "Conflict Victim" remains in the list (Rebased).
    *   *Constraint*: The "Red Box" proves `recovery_ops` were applied.

### B. Connection Resume
1.  **Click `Reconnect`**.
    *   **Observe**:
        1.  Status changes to `disconnected`.
        2.  Status returns to `connected`.
        3.  Check Server Terminal: Should see logs about `Last-Event-ID`.
