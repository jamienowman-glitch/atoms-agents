# Tech Spec: Microsite Template Upgrade (Baseline Features)

**Status**: PROPOSED
**Architect**: Antigravity

## 1. Executive Summary
The current `microsite-template` is a functional visual shell but lacks the critical "Production Infrastructure" required for the "Website Printing Press". 
To support high-volume sites, we must inject a standard "Engine" into the template that handles **SEO**, **Analytics**, **Legal Compliance**, and **Pricing** automatically.

## 2. Architecture: "The Engine"

We will upgrade the template by adding a standardized `src/engine/` directory (or specialized `lib/` modules) that all future pages consume.

### A. SEO & Metadata Engine
*   **Standard**: Every page exports `generateMetadata()`.
*   **Files**:
    *   `app/sitemap.ts`: Dynamic generation based on routes.
    *   `app/robots.ts`: Standard allow/disallow rules.
    *   `app/layout.tsx`: Inject `JSON-LD` (Organization/WebSite) schema.

### B. Analytics & UTM Engine
*   **Analytics**: `components/analytics/AnalyticsProvider.tsx` (Client Component).
    *   Loads GA4 / GTM / Pixel (via `next/script`).
    *   Hooks into Router events for Pageviews.
*   **UTM**: `hooks/useUtmCapture.ts`.
    *   On load, parses `window.location.search`.
    *   Persists to `localStorage` (key: `atoms_utm_context`).
    *   `Link` wrapper or interceptor to append UTMs to outbound CTA clicks.

### C. Snax Pricing Engine
*   **Wiring**: `context/PricingContext.tsx`.
    *   Fetches `discount_policy` from `atoms-core` (Supabase).
    *   Exposes `price`, `discountedPrice`, `currency`.
*   **Components**:
    *   `<SnaxBalance />`: Shows user's wallet balance (if logged in).
    *   `<PriceDisplay />`: Auto-calculates discounts.

### D. Middleware "The Brain"
*   **File**: `middleware.ts`.
*   **Logic**:
    *   **Geo**: Detects country/city (via Vercel/Cloudflare headers).
    *   **Personalization**: Sets `x-user-segment` cookie based on UTMs or Referrer.

## 3. Atomic Task Plan

### Phase 1: The Core Plumbing (Worker A)
**Goal**: SEO, Robots, and Analytics.
*   [ ] **Scaffold**: Create `src/lib/seo`, `src/lib/analytics`.
*   [ ] **Implement**: `app/sitemap.ts` and `app/robots.ts`.
*   [ ] **Implement**: `<AnalyticsProvider />` with GA4/Pixel stubs (ready for ID injection).
*   [ ] **Implement**: `JSON-LD` generator in `layout.tsx`.

### Phase 2: The Conversion Engine (Worker B)
**Goal**: UTM Capture and Pricing.
*   [ ] **Implement**: `useUtmCapture` hook (Storage + Append).
*   [ ] **Scaffold**: `middleware.ts` for Geo/Segment detection.
*   [ ] **Implement**: `<SnaxBalance />` stub (Connects to `atoms-core` RPC later).
*   [ ] **Compliance**: Add `components/legal/` (Privacy/Terms placeholders).

## 4. Verification Plan
*   **SEO**: Use `view-source` on localhost to verify `<title>`, `<meta name="description">`, and `<script type="application/ld+json">`.
*   **Analytics**: Check Network tab for `collect` calls (GA4) or console logs.
*   **UTM**: Append `?utm_source=test` -> Check Application/LocalStorage.
