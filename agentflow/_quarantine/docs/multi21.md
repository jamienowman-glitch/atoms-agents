> Note: This is the spec for the Multi²¹ component.  
> For planning/backlog see `docs/10_MULTI21_PLAN.md`. For repo-level rules see `docs/MANIFESTO.md`.

# MULTI 2¹

MULTI 2¹ is a 24-column grid-based card layout system designed to render various types of items (YouTube feeds, products, collections, etc.) in a flexible, responsive grid.

## Purpose

This component serves as a "brick" in a larger 24-column page grid. It abstracts away the complexity of responsive grid layouts, allowing for easy integration of diverse content types.

## Shell vs. App Architecture

**Multi²¹ is a builder app** (a "Shopify-like" drag-and-drop builder) that lives on top of a **generic UI Shell**.

*   **The Shell**: Provides app-agnostic primitives like Floating Launchers, Stacks, Vertical/Horizontal Toolbars, and the Tool Registry. These will later be reused by other apps (AgentFlow, Email/CRM builders, POD surfaces).
*   **The App (Multi²¹)**: Configures these primitives via the **Tool Registry** and **Config**, rather than hard-wiring bespoke toolbar components. It focuses on the grid logic and tile rendering.

## API Reference

### `Multi21Props`

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `items` | `Multi21Item[]` | Required | Array of items to render. |
| `colsDesktop` | `number` | `6` | Number of columns on desktop (min-width: 768px). Based on a 24-column grid mental model. |
| `colsMobile` | `number` | `2` | Number of columns on mobile. |
| `tileGap` | `number` | `16` | Gap between grid items in pixels. Set to 0 for seamless tiles. |
| `tileRadius` | `number` | `8` | Border radius of the card images in pixels. Set to 0 for hard corners. |
| `align` | `'left' \| 'center' \| 'right'` | `'center'` | Alignment of the grid within its container. |
| `showTitle` | `boolean` | `true` | Whether to show the item title. |
| `showMeta` | `boolean` | `true` | Whether to show the item meta text. |
| `showBadge` | `boolean` | `true` | Whether to show the item badge. |
| `showCtaLabel` | `boolean` | `true` | Whether to show the CTA label text. |
| `showCtaArrow` | `boolean` | `true` | Whether to show the CTA arrow icon. |

### 24-Column Mental Model

MULTI 2¹ is designed to be a "brick" within a larger 24-column page layout.
- `colsDesktop` represents how many columns of that 24-column grid this component's items should span *conceptually* if the component itself spans the full width.
- In the future, this component may be embedded in a layout wrapper that controls its overall width and alignment on the page.
- The `align` prop allows you to control how the grid sits within its container, useful when the total width of columns + gaps is less than the container width.

### Design-Time vs Run-Time

- **Design-Time (UItreX):** All props are exposed in the `Multi21Designer` for tweaking.
- **Run-Time (OS/Agents):** Agents will likely control `items`, `colsDesktop`, `colsMobile`, and content toggles. `tileGap`, `tileRadius`, and `align` might be set by the system's design tokens or specific layout requirements.

### `Multi21Item`

```typescript
interface Multi21Item {
  id: string;
  title: string;
  meta?: string;
  imageUrl?: string;
  href?: string;
  badge?: string;
  secondaryLink?: {
    href: string;
    label?: string;
  };
}
```

## Usage

### Design-Time (This Repo)

In this repository, use the `Multi21Designer` component to visualize and tweak the grid settings. This component provides a UI to adjust columns, gaps, and visibility toggles live.

Route: `/multi21`

### Production (Future)

In the final application, use the `Multi21` base component directly. It should be driven by props, likely coming from a CMS or API response.

```tsx
import { Multi21 } from '@/components/multi21/Multi21';

<Multi21 
  items={myItems}
  colsDesktop={8}
  colsMobile={2}
  gap={20}
/>
```

## Styling

The component uses Tailwind CSS for layout and styling. It integrates `Roboto Flex` as the primary font.
The grid uses CSS variables for column counts to allow dynamic updates from the designer UI.

### CSS Variables

The component uses the following CSS variables for styling:

| Variable | Description | Default |
| :--- | :--- | :--- |
| `--multi-cta-arrow-color` | Color of the CTA arrow stroke. | `currentColor` |

## 5. Core Surfaces Spec

### 5.1 Signup Surface (`surface-onboarding`)

*   **Atoms**:
    *   `atom-signup-account`: Email, Password/Magic Link, Full Name, ToS/Privacy.
    *   `atom-signup-business`: Business Name, Slug, Website, Country/Timezone.
    *   `atom-signup-usecase`: Multi-select chips, "Main thing" (90-day goal).
    *   `atom-signup-consent`: Training consent, Marketing consent.
*   **Events**: `signup_viewed`, `signup_started`, `signup_step_completed`, `signup_completed`.

### 5.2 Connectors Hub (`surface-connectors`)

*   **Layout**: Card-per-connector.
*   **Atoms**: `atom-connectors-card-{service}` (e.g. `shopify`, `ga4`, `meta`).
*   **Card UI**:
    *   Logo + Name + Status Pill (Not connected / Connected / Error).
    *   Connect/Edit button.
    *   **Strategy Lock** info icon ("What this connector allows").
    *   **3-Wise** check icon ("Is this a good idea?").
*   **Forms**:
    *   Shopify: `shop_domain`, `api_key`, `api_version`.
    *   GA4: `measurement_id`, `api_secret`.
    *   Meta: `pixel_id`, `access_token`.
*   **Backend Contract**: POST `/api/connectors/save` -> writes to GSM `connectors-{TENANT_ID}-{CONNECTOR_NAME}`.

### 5.3 Chat Rail (`surface-chat`)

*   **States**:
    *   **Nano**: Only last agent message visible.
    *   **Micro**: Last message + Input.
    *   **Standard**: Half-screen history.
    *   **Full Screen**: Dedicated view.
*   **Input Controls**:
    *   **3-Wise Band**: Pre-strategy vs Strategy vs Execution indicator.
    *   **Fire / Refine**: Auto-prompt improvement.
    *   **Attachment**: Upload to Nexus.
*   **Agent Message Actions**:
    *   **Strategy Lock**: Summarise plan -> Request confirmation.
    *   **Save this**: Store to Saved/Nexus.
    *   **3-Wise check**: Audit the plan.
    *   **Remind me**: iCal hook.
    *   **Undo**: Rollback conversation state.
    *   **To-Do**: Convert to task card.
*   **Streaming**: Grid of small squares that animate ONLY on real work.
*   **Persona**: One consistent character per app (backed by clusters).
