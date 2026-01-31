# Atomic Task Plan: The Site Factory (Zero-to-Live)

**Goal**: Create a "God Tool" skill that fully automates launching a new client website in <30 seconds.
**Flow**: `Buy Domain` -> `Create GitHub Repo` -> `Push Template` -> `Deploy Cloudflare Pages`.

## 1. The Stack & Provider Strategy
*   **Domain Wholesaler**: **Cloudflare Registrar**.
    *   *Why*: Zero markup pricing, single API key (you already use Cloudflare), tight integration with Pages.
    *   *Requirement*: Add `CLOUDFLARE_API_TOKEN` (with Registrar permissions) to Vault.
*   **Repo Host**: **GitHub**.
    *   *Requirement*: `GITHUB_ACCESS_TOKEN` in Vault.
*   **Hosting**: **Cloudflare Pages**.
    *   *Requirement*: Same `CLOUDFLARE_API_TOKEN`.

## 2. The Architecture (`atoms-muscle/src/factory/site_spawner`)

### A. The "God Skill" (`create_site`)
A single Muscle that orchestrates the entire chain.
*   **Input**:
    *   `project_name`: e.g., "nike-campaign".
    *   `domain_strategy`: "subdomain" | "purchase".
    *   `domain_name`: "nike-campaign.com" (if purchase).
    *   `template_id`: "ecom/brutalist".
*   **Process**:
    1.  **Domain**:
        *   If `subdomain`: Add DNS record `nike-campaign.jaynowman.com`.
        *   If `purchase`: Call Cloudflare Registrar API -> Buy.
    2.  **Repo**:
        *   Call GitHub API -> Create `jaynowman/site-nike-campaign` (Private).
        *   Clone Template (`atoms-site-templates/ecom/brutalist`).
        *   Inject `Mother Harness` features (SEO, Tracking).
        *   Push to new Repo.
    3.  **Deploy**:
        *   Call Cloudflare Pages API -> Create Project.
        *   Link to `jaynowman/site-nike-campaign` (main branch).
        *   Bind Custom Domain.
    4.  **Register**:
        *   Insert row into Supabase `public.sites`.

### B. The UI (`atoms-app/dashboard/factory`)
*   **Inputs**:
    *   Site Name (Text).
    *   Domain Picker (Dropdown: Current Domains | "Buy New").
    *   Template Picker (Dropdown: Scanned from `atoms-site-templates`).
*   **Action**: "Ignite" Button -> Calls the Muscle.
*   **Status**: Live stream of steps ("Buying Domain...", "Creating Repo...", "Deploying...").

## 3. Atomic Tasks (The Worker)
- [ ] **Muscle**: Build `atoms-muscle/src/factory/site_spawner/`.
    *   `service.py`: The orchestration logic (CF + GH APIs).
    *   `mcp.py`: The Agent Tool wrapper.
    *   `SKILL.md`: "Create a new website from template X on domain Y".
- [ ] **UI**: `atoms-app/src/app/dashboard/factory/page.tsx`.
- [ ] **Vault**: User to verify `CLOUDFLARE_API_TOKEN` has `Registrar` and `Pages` permissions.
