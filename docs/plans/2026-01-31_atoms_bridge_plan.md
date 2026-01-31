# Atomic Task Plan: The Atoms Bridge (Website Reconnection)

**Goal**: "Reconnect" the external website (`~/sites/atoms-fam`) to the `atoms-app` tools so the Sitemap and Content can be managed locally, while keeping the deployment separate.

## 1. The Problem
*   **Split**: The website code was moved to `~/sites/atoms-fam` (Correct).
*   **Build Fail**: Cloudflare is likely still watching the `atoms-ui` / `atoms-app` repo for website changes that are no longer there (User Action Required: Disconnect Project in Cloudflare).
*   **Disconnect**: The local `atoms-app` tools can't see the new external site location.

## 2. The Solution: "Atoms Bridge" API
We will build a Local Host Bridge in `atoms-app` that allows the Workbench to read/write files in `~/sites/atoms-fam`.

### A. The Bridge API (`atoms-app/src/app/api/bridge/`)
We will create a set of API routes in `atoms-app` that bypass the sandboxing by using server-side `fs` (Node.js) to access the specific external path.

*   `src/app/api/bridge/sitemap/route.ts`:
    *   **GET**: Reads `/Users/jaynowman/sites/atoms-fam/SITEMAP_DRAFT.md`.
    *   **POST**: Writes updates to `SITEMAP_DRAFT.md`.

### B. The Workbench UI (`atoms-app/src/app/workbench/page.tsx`)
*   Update the Workbench to fetch from `/api/bridge/sitemap` instead of local state.
*   Add an "Export to Site" button that triggers the POST.

## 3. Atomic Tasks
- [ ] **Action (User)**: Go to Cloudflare Dashboard -> Projects. Find the legacy project linked to `atoms-ui/atoms-app`. **Disable Automatic Builds** or **Disconnect Repo**.
- [ ] **API**: Create `atoms-app/src/app/api/bridge/sitemap/route.ts`.
    *   Hardcode path: `/Users/jaynowman/sites/atoms-fam`.
- [ ] **UI**: Update `atoms-app/src/app/workbench/page.tsx` (or created dedicated `SiteManager` component) to use the Bridge.

## 4. Verification
*   **Manual**: Open `atoms-app` (port 3001). Load Workbench. Verify it shows the content of `~/sites/atoms-fam/SITEMAP_DRAFT.md`.
