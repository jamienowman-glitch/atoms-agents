# Atomic Plan: Phase 11 Console & Auth

**Objective**: Build the Authenticated "Launcher" in `atoms-app`.

## Phase 1: Authentication (Supabase)
- [ ] **Install**: `npm install @supabase/ssr @supabase/supabase-js` in `atoms-app`.
- [ ] **Env**: Configure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- [ ] **Create `src/lib/supabase.ts`**: Client initialization.
- [ ] **Create `src/app/login/page.tsx`**: Simple Email/Password or Magic Link form.
- [ ] **Middleware**: Protect `/` and `/contract-builder` routes (redirect to `/login`) — `/contract-builder` is the Contract Builder route.

## Phase 2: Registry Client Update
- [ ] **Update `harness/registry/client.ts`** (atoms-ui):
    -   Add `getSurfaces()`.
- [ ] **Update `harness/transport/index.ts`** (atoms-ui):
    -   Allow dynamic token injection (for the JWT).

## Phase 3: Console UI (atoms-ui)
- [ ] **Create `harness/console/SurfaceCard.tsx`**.
- [ ] **Create `harness/console/LauncherGrid.tsx`**.

## Phase 4: App Integration (atoms-app)
- [ ] **Create `src/app/page.tsx`**:
    -   Fetch User Session.
    -   Fetch Surfaces (Launcher).
- [ ] **Create `src/app/surface/[slug]/page.tsx`**:
    -   The Workspace Shell.

## Verification
-   **Manual**:
    -   Visit `localhost:3001`. Should redirect to `/login`.
    -   Log in (Account: `demo@atoms.app` / `password`).
    -   See Launcher.
    -   Launch "Marketing Surface" (`AGNˣ`).
