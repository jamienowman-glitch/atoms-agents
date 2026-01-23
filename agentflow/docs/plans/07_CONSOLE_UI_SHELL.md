# Phase 7: The Console Shell (Closing the Circle)

## 1. Objective
We are building the "Chameleon." The UI (`agentflow`) is generic. The Backend (`northstar-engines`) tells the UI: "You are now the Marketing Console." or "You are now the Health Console."

This plan implements the **Console Shell**, connecting the "OS" (Engine) to the "Glass" (UI) via the **Bootstrap Law**.

## 2. The Recon Map
These are the verified plumbing points for the integration:

### A. Northstar Engines (The OS)
*   **Identity Models:** `northstar-engines/engines/identity/models.py` (Defines `User`, `Tenant`, `Surface`)
*   **Bootstrap API:** `northstar-engines/engines/identity/routes_bootstrap.py` (The entry point)

### B. Agentflow (The Glass)
*   **Global State:** `agentflow/context/ConsoleContext.tsx` (Will hold the Identity)
*   **UI Component:** `agentflow/components/workbench/WorkbenchHeaderLozenge.tsx` (The "Top Pill" to display Console Name)

## 3. The Contract: `GET /api/v1/bootstrap`

The Bootstrap API is the "Handshake." It tells the UI who the user is and what "Console" they are looking at.

**Request:**
*   Headers: `X-User-ID` (Required for Phase 7 mock auth)

**Response:**
```json
{
  "user": {
    "id": "u_12345",
    "email": "jay@northstar.com",
    "display_name": "Jay Nowman"
  },
  "tenant": {
    "id": "t_system",
    "name": "System Tenant"
  },
  "console": {
    "id": "s_default_console",
    "name": "Northstar Console",
    "theme": "dark",
    "surface_id": "s_default_console"
  }
}
```

## 4. Execution Plan

### Step 1: Refine Engine Bootstrap
*   Modify `northstar-engines/engines/identity/routes_bootstrap.py`.
*   Ensure it returns the strict `console` object structure.
*   Fallback to "Northstar Console" if no specific surface is found.

### Step 2: Upgrade ConsoleContext
*   Modify `agentflow/context/ConsoleContext.tsx`.
*   Add `ConsoleIdentity` interface matching the contract.
*   On mount, fetch `/api/v1/bootstrap`.
*   Store `identity` in the context state.

### Step 3: Connect the Lozenge
*   Modify `agentflow/components/workbench/WorkbenchHeaderLozenge.tsx`.
*   Consume `useConsole()`.
*   If `identity` is loaded, display `identity.console.name` instead of hardcoded/icon-only views.
*   (Optional) Use `identity.console.theme` for styling.

## 5. Verification
*   Start the Engine.
*   Start the UI.
*   Observe the "Top Pill" change from generic to "Northstar Console" (or specific name).
