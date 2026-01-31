# Route Inventory Report: The 42 Paths

**Status**: Verified by Crawl (2026-01-31)
**Total Routes**: 42
**Goal**: Consolidate ALL into `/dashboard`.

## 1. The "God Mode" Orphans (To Be Moved)
*These 11 routes are currently nested in `src/app/god/*` and must be moved to `/dashboard/*`.*

1.  `src/app/god/config/canvases/page.tsx`
    *   **Destination**: `/dashboard/canvases`
2.  `src/app/god/config/connectors/page.tsx`
    *   **Destination**: `/dashboard/connectors`
3.  `src/app/god/config/muscles/page.tsx`
    *   **Destination**: `/dashboard/muscles`
4.  `src/app/god/config/page.tsx`
    *   **Destination**: `/dashboard/config` (or merge to root)
5.  `src/app/god/config/pricing/discounts/page.tsx`
    *   **Destination**: `/dashboard/finance/discounts`
6.  `src/app/god/config/pricing/page.tsx`
    *   **Destination**: `/dashboard/finance`
7.  `src/app/god/config/spaces/page.tsx`
    *   **Destination**: `/dashboard/spaces`
8.  `src/app/god/config/surfaces/page.tsx`
    *   **Destination**: `/dashboard/surfaces`
9.  `src/app/god/config/tools/page.tsx`
    *   **Destination**: `/dashboard/tools`
10. `src/app/god/factory/page.tsx`
    *   **Destination**: `/dashboard/sites`
11. `src/app/god/page.tsx`
    *   **Action**: Delete (Redirect to `/dashboard`)

## 2. The Root Orphans (To Be Rescued)
*These 3 routes are floating at the root level.*

12. `src/app/contract-builder/page.tsx`
    *   **Destination**: `/dashboard/tools/contract-builder`
13. `src/app/maybes/page.tsx`
    *   **Destination**: `/dashboard/canvases/maybes`
14. `src/app/workbench/page.tsx`
    *   **Destination**: `/dashboard/workbench`

## 3. The Dashboard Citizens (To Be Preserved)
*These 24 routes are already correctly located in `/dashboard`.*

15. `src/app/dashboard/cogs/page.tsx`
16. `src/app/dashboard/config/providers/page.tsx`
17. `src/app/dashboard/infra/cost/gcp/page.tsx`
18. `src/app/dashboard/infra/cost/page.tsx`
19. `src/app/dashboard/infra/free-tiers/aws/page.tsx`
20. `src/app/dashboard/infra/free-tiers/azure/page.tsx`
21. `src/app/dashboard/infra/free-tiers/google/page.tsx`
22. `src/app/dashboard/infra/free-tiers/page.tsx`
23. `src/app/dashboard/infra/free-tiers/saas/page.tsx`
24. `src/app/dashboard/infra/page.tsx`
25. `src/app/dashboard/infra/registries/page.tsx`
26. `src/app/dashboard/infra/storage/page.tsx`
27. `src/app/dashboard/memory/page.tsx`
28. `src/app/dashboard/models/cost/[provider]/page.tsx`
29. `src/app/dashboard/models/cost/page.tsx`
30. `src/app/dashboard/muscles/page.tsx` (**Merge Conflict**: Check `god/config/muscles`)
31. `src/app/dashboard/observability/page.tsx`
32. `src/app/dashboard/page.tsx` (**The Launchpad**)
33. `src/app/dashboard/pricing/page.tsx` (**Merge Conflict**: Check `god/config/pricing`)
34. `src/app/dashboard/sites/page.tsx` (**Target for Site Factory**)
35. `src/app/dashboard/subscriptions/agentflows/page.tsx`
36. `src/app/dashboard/subscriptions/page.tsx`
37. `src/app/dashboard/tuning/page.tsx`
38. `src/app/dashboard/typography/page.tsx`

## 4. The System Routes (To Be Preserved)
*These 4 routes are structural.*

39. `src/app/login/page.tsx`
40. `src/app/page.tsx` (Landing)
41. `src/app/surface/[slug]/page.tsx` (Public Surface)
42. `src/app/system/health/page.tsx` -> (Move UI to `/dashboard/health`)
