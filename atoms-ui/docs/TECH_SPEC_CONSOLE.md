# Tech Spec: The Console & Surface Harness

> **Note**: This doc previously referenced `atoms-registry/` YAML files. The file-based registry has been deprecated/quarantined; surfaces are now sourced from the DB registry (Supabase / `atoms-core` APIs).

## 1. Objective
Build the **Console Harness** in `atoms-app`. This is the user's entry point.
-   **Dashboard**: Displays available Surfaces (Apps).
-   **Context Switcher**: Handles routing into a Surface (e.g., `/app/agnx`, `/app/mc2`).
-   **Isolation**: Ensures "Health Data" (=mc2) doesn't leak into "Marketing Flows" (AGNˣ).

## 2. Registry Integration
The Console pulls the list of available Surfaces from the **DB registry** (Supabase).
-   **Spec**: `id`, `name`, `icon`, `theme` (JSON/YAML).
-   **Loader**: `RegistryClient.getSurfaces()`.

## 3. The App Shell (`atoms-app`)
-   **Layout**: `ConsoleLayout.tsx` (Sidebar/TopBar).
-   **Route**: `/` (Launcher) -> `/surface/[surfaceId]` (The App).
-   **State**: `SurfaceContext.tsx` holds the current `surfaceId` and `theme`.

## 4. Implementation Steps
1.  **Registry**: Verify Supabase has the surface definitions (AGNˣ, CUBED3, etc.).
2.  **API**: Update `RegistryClient` to fetch Surfaces.
3.  **UI**: Create `SurfaceCard` and `LauncherGrid`.
4.  **Routing**: Implement dynamic routes in Next.js (`src/app/surface/[slug]/page.tsx`).
