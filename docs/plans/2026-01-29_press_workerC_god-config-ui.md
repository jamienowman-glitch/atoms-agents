# Worker C — God Config UI (Atomic Task Plan)

## Role
Frontend Engineer (Dashboard)

## Objective
Add a God Config UI page to trigger the Press workflow and wire it to Supabase + spawn_site.py.

## Constraints (Hard Laws)
- Flat sections with collapsible headers; no nested cards.
- Mobile-first layout.
- Dropdowns must be Supabase-backed with “Plus” buttons to add new records.
- No extra danger levels or gating fields; firearms gate only when applicable.

## Phase 1 — Environment Setup (MANDATORY FIRST STEP)
1) Create page:
   - `/Users/jaynowman/dev/atoms-app/src/app/god/factory/page.tsx`
2) Create API route:
   - `/Users/jaynowman/dev/atoms-app/src/app/api/god/factory/spawn/route.ts`

## Phase 2 — UI + Wiring
1) Build form UI:
   - Site Name
   - URL Prefix
   - Template dropdown (from `public.site_templates`)
   - Root Domain dropdown (from `public.owned_domains`)
2) Add “Plus” buttons next to dropdowns:
   - Open inline add or modal to insert new records into Supabase
3) Add Go button:
   - Calls `/api/god/factory/spawn`
   - Triggers `spawn_site.py` server-side (subprocess or internal runner)
4) Empty-state UX:
   - If no templates/domains exist, show a friendly empty state with CTA to add

## Deliverables
- New page with working form and Supabase-backed dropdowns.
- API route that triggers the press workflow.
- Empty-state UX for first run.

## Validation
- Open `/god/factory` and verify:
  - dropdowns populate
  - add new record works
  - Go button triggers server route

## Kickoff Prompt (for the Worker)
Role: Frontend Engineer
Goal: Build the God Config “Press” UI at /god/factory with a Supabase-backed form and a Go button that triggers spawn_site.py through an API route. Follow layout constraints (flat, collapsible, mobile-first) and include empty-state UX. Report exact paths and show a quick walkthrough of the flow.
