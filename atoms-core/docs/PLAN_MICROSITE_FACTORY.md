# Strategy: The Microsite Factory

## 1. The Vision
A "God Mode" button: `[+ Add Surface]`.
**Result**:
1.  Database Entry (`surfaces` table) created.
2.  **New Website** Deployed (e.g., `x3-spatial.atoms.app`).
3.  **Pre-Loaded**: Blog, Brand Story, Pricing, Auth, Stripe.

## 2. Feasibility: Very High
This is a standard "Programmatic Infrastructure" pattern.
-   **Host**: Cloudflare Pages (Excellent API, Fast, Free Tier generous).
-   **Method**: We don't need to "copy files". We can point Cloudflare to a **Single GitHub Repo** (`atoms-site-template`) but deploy it multiple times with different **Environment Variables** (`NEXT_PUBLIC_SURFACE_KEY=x3`).
-   **Result**: One codebase to maintain, infinite microsites.

## 3. The Roadmap (What to do First)

### Phase 1: The Golden Template ("atoms-site")
Before we clone anything, we need one "Perfect Atom".
*   **Action**: Turn the current `atoms-site` into the Master Template.
*   **Must Haves**:
    1.  **Stripe Integration**: **YES, do this now.** Every site needs to sell. If we add it later, we have to update 10 sites. Add it to the Master.
    2.  **Standard Pages**: `prose/blog`, `story`, `pricing`.
    3.  **Dynamic Config**: The site must read its content based on `NEXT_PUBLIC_SURFACE_KEY`.

### Phase 3: The Content Engine (Feeds)
*   **The Database**: `public.feeds` table.
    *   `tenant_id`: Owner.
    *   `source_url`: (e.g., YouTube Playlist URL).
    *   `output_target`: (e.g., `blog`, `social`).
*   **The Muscle**: `atoms-muscle/feed_reader`.
    *   Runs hourly.
    *   Fetches new items from RSS/YouTube.
    *   **Agentic Step**: "Watch video -> Generate Summary -> Write Blog Post".
    *   **Publish**: Pushes new content to the Microsite (Git Commit or DB Insert).

### Phase 4: The Flow Registry
You asked: "How do I see top flows in the Console?"
*   **Definition**: A "Flow" is a saved configuration of:
    *   **Canvas** (The UI, e.g., 'WebsiteBuilder').
    *   **Agent** (The Persona).
    *   **Task** (The Goal).
*   **Execution**: We create a `public.flows` table in Supabase.
    *   The Console queries this to show: "Create Website (Flow)" or "Analyze Feed (Flow)".
    *   Clicking it opens the **Canvas** pre-loaded with that Agent/Task.
