# SKILL: Upgrade Site to Engine Standard

## Context
We are upgrading "Naked" Next.js microsites to the "Engine Standard". This ensures all sites have robust SEO, Analytics, Pricing, and Compliance features out of the box.

## Role
You are the **Microsite Engine Mechanic**. You take a basic site and install the V8 Engine.

## Process
1.  **Analyze**: Check what is missing (SEO, Analytics, Pricing).
2.  **Scaffold**: Create the necessary directory structure (`src/engine/` or `src/lib/`).
3.  **Implement Core**:
    *   Add `sitemap.ts` and `robots.ts`.
    *   Add `generateMetadata` to pages.
    *   Add `AnalyticsProvider` and `PricingContext`.
4.  **Wire**: Connect the providers in `app/layout.tsx`.
5.  **Verify**: Ensure all parts are working.

## Instructions
<step_1_analyze>
Check the current state of the site.
- Does `app/sitemap.ts` exist?
- Does `app/robots.ts` exist?
- Is there an analytics provider in `app/layout.tsx`?
- Is `PricingContext` wrapping the app?
</step_1_analyze>

<step_2_scaffold>
Create the following directories if they don't exist:
- `src/lib/seo`
- `src/lib/analytics`
- `src/context` (for PricingContext)
- `src/components/analytics`
- `src/components/legal`
</step_2_scaffold>

<step_3_implement_core>
**SEO**:
- Create `app/robots.ts`:
  ```ts
  import { MetadataRoute } from 'next'

  export default function robots(): MetadataRoute.Robots {
    return {
      rules: {
        userAgent: '*',
        allow: '/',
        disallow: '/private/',
      },
      sitemap: 'https://acme.com/sitemap.xml',
    }
  }
  ```
- Create `app/sitemap.ts` (dynamic generation).

**Analytics**:
- Create `src/components/analytics/AnalyticsProvider.tsx`.
  - Must use `usePathname` and `useSearchParams` to track pageviews.
  - Must accept children.

**Pricing**:
- Create `src/context/PricingContext.tsx`.
  - Fetch discount policy.
  - Provide `price`, `discountedPrice`, `currency`.

**Middleware**:
- Create `middleware.ts` for Geo/Segment detection.
</step_3_implement_core>

<step_4_wire>
Update `app/layout.tsx`:
- Import `AnalyticsProvider` and `PricingContext`.
- Wrap the children:
  ```tsx
  <PricingContext>
    <AnalyticsProvider>
      {children}
    </AnalyticsProvider>
  </PricingContext>
  ```
- Inject JSON-LD in `<head>` or as a script component.
</step_4_wire>

<step_5_verify>
- Run `npm run build` to ensure no type errors.
- Check `sitemap.xml` and `robots.txt` generation.
- Verify provider wrapping in `layout.tsx`.
</step_5_verify>

## Verification
1.  **Build Check**: Run `npm run build`.
2.  **Code Check**: Read `app/layout.tsx` to confirm `AnalyticsProvider` and `PricingContext` are present.
3.  **File Check**: Confirm `app/sitemap.ts` and `app/robots.ts` exist.
