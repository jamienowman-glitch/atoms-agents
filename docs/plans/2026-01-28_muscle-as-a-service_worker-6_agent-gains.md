# 2026-01-28 — Operation Muscle-as-a-Service: Worker 6 (AgentGains Site)

## Mission
Build a greenfield marketing site for agent-gains.squared-agents.app in a **new repo outside /Users/jaynowman/dev**.

## Scope (Allowed Paths)
- NEW directory outside `/Users/jaynowman/dev` (e.g., `/Users/jaynowman/agent-gains-site`)
- No changes inside this monorepo.

## Hard Laws (Do Not Break)
- **Do not reuse components** from existing repos.
- **No .env files** in this monorepo. Use Cloudflare Pages env vars.
- **Design-led:** ask for direction first.

## Tasks (Atomic)
1. **Initialize Project**
   - Use Astro or Vite (React), minimal dependencies.
   - Add README with Cloudflare Pages deploy steps.

2. **Design Discovery**
   - Ask 3 questions: typography direction, vibe, layout style.
   - Only after user answers, build the design system.

3. **Dynamic Pricing Grid**
   - Fetch from Supabase (public read), client-side only.
   - Render muscles + pricing + status.

4. **Crypto Top‑Up UI**
   - Provide a placeholder interface for top‑up (no backend required yet).

5. **Snax Explanation**
   - Clear pricing narrative and conversion rate.

## Deliverables / Definition of Done
- New repo builds locally and is deployable on Cloudflare Pages.
- Pricing grid loads from Supabase env vars.
- README documents env vars + deploy steps.

## Notes / Risks
- Keep codebase isolated from this monorepo.
