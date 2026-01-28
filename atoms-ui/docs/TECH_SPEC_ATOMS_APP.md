# Tech Spec: Atoms App (The Console)

## 1. Objective
A clean, lightweight "Application Shell" to host the Console, User Flows, and the Contract Builder.
-   **Role**: The container for `atoms-ui` components.
-   **Contrast**: `atoms-site` = Marketing (Public). `atoms-app` = Console (Private/Auth).

## 2. Architecture
-   **Framework**: Next.js 14+ (App Router).
-   **Dependencies**: `atoms-ui` (Local Workspace Link or Import).
-   **Routing**:
    -   `/`: The Console (Dashboard).
    -   `/contract-builder`: The Visual Contract Editor.
    -   `/flow/{id}`: An active canvas/agent session.

## 3. The Contract Builder Route
We will mount the `ContractBuilderCanvas` from `atoms-ui` at `/contract-builder`.
-   It will interpret `atoms-ui/canvases/contract_builder/ContractBuilderCanvas.tsx`.
-   It will use `atoms-ui/harness/context/ToolControlContext`.

## 4. Setup Plan
1.  Initialize `atoms-app`.
2.  Configure `tsconfig` paths to point `@atoms-ui/*` to `../atoms-ui/*`.
3.  Create `/src/app/contract-builder/page.tsx` importing the Canvas.
