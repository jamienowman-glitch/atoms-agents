# Feed Block Ingest Brief

**Created**: 2025-12-03  
**Purpose**: Planning document for ingesting feed block / tile components into the aitoms_fam atom library.

---

## Atom candidate: multi_feed_tile

### Source reference
- Legacy snapshot: [`docs/reference/feed_block/feed_block_spec_snapshot_legacy.md`](file:///Users/jaynowman/dev/aitoms_fam/docs/reference/feed_block/feed_block_spec_snapshot_legacy.md)

### Purpose
A single reusable tile atom that can render multiple content types within grid-based feed layouts. This is the fundamental "cell" component used inside `multi_feed_grids` and other grid/feed layouts.

**Supported content types**:
- **Image**: Static image with optional overlay text
- **Video**: Video thumbnail with play button overlay
- **KPI**: Key performance indicator (metric value + label)
- **Product**: E-commerce product card with optional CTA
- **(Future)**: Additional content types can be added via mode extension

### Baseline behaviour

#### Interaction
- **Clickable by default**: Each tile is clickable unless explicitly disabled via token
- **Click event**: Fires with tile ID and tracking key (no PII, no full URLs)
- **Hover state**: Subtle visual feedback (e.g., slight scale or opacity change)
- **Drag support**: Optional drag-and-drop capability controlled by token

#### Mode switching
- Tile appearance and behavior determined by `mode` field in data schema
- Modes: `image | video | kpi | product | text`
- Each mode uses the same base layout structure with mode-specific content rendering

#### CTA support
- Product mode includes optional call-to-action button
- CTA can later map into Shopify / e-commerce connectors
- CTA is a separate clickable zone from the main tile click

### Styling constraints

#### Base aesthetic
- **Black / flat base style**: No neon, no gradients
- **Minimal decoration**: Focus on content, not ornamental effects
- **Dark mode native**: Design for dark backgrounds by default

#### Typography
- **Font**: Roboto Flex ONLY
- **Weight/axis control**: Use axis tokens for any font presets (no hardcoded weights)
- **Hierarchy**:
  - Title: Primary text, medium weight
  - Subtitle/label: Secondary text, lighter weight
  - Metric value (KPI): Large, bold

#### Layout
- **Grid-agnostic**: Must work inside multi-column grids (1-up, 2-up, 3-up, 4-up)
- **Aspect ratio**: Configurable via token (square, portrait, landscape)
- **Responsive**: Adapts to container width, no fixed pixel sizes
- **Spacing**: All internal padding/margins use spacing tokens

### Data shape (draft)

```typescript
interface MultiFeedTileData {
  // Core identity
  id: string;                          // Unique tile identifier
  mode: 'image' | 'video' | 'kpi' | 'product' | 'text';
  
  // Content
  title: string;
  subtitle?: string;
  label?: string;                      // Alternative to subtitle for certain modes
  
  // Media
  media_src?: string;                  // Image/video URL or ID
  media_aspect?: 'square' | 'portrait' | 'landscape';
  
  // KPI mode
  metric_value?: string | number;      // e.g., "1.2M" or 1200000
  metric_label?: string;               // e.g., "Total Views"
  metric_change?: number;              // e.g., +12.5 (percentage)
  
  // Product mode
  product_id?: string;                 // Maps to ecom systems later
  price?: string;                      // e.g., "$49.99"
  currency?: string;                   // e.g., "USD"
  
  // CTA (when applicable)
  cta_label?: string;                  // e.g., "Add to Cart"
  cta_href?: string;                   // Internal route or action ID (not full URL)
  
  // Tracking
  tracking_key: string;                // Event tracking identifier (no PII)
  
  // Interaction
  clickable?: boolean;                 // Default: true
  draggable?: boolean;                 // Default: false
}
```

### Implementation guidance

#### Token-based styling
- **All styling must use exposed tokens**, not hardcoded values
- **No Tailwind classes in atom code**: Use CSS custom properties or styled-components with token references
- **Tokens to expose**:
  - `tile_bg_color`
  - `tile_border_color`
  - `tile_border_radius`
  - `tile_padding`
  - `tile_gap` (internal spacing)
  - `tile_hover_scale`
  - `tile_aspect_ratio`
  - Typography tokens (size, weight, color for title/subtitle/label)

#### Typography implementation
- **Roboto Flex only**: No fallback fonts, no alternative typefaces
- **Use axis tokens**: Define presets like `title_weight`, `subtitle_weight` using Roboto Flex variable axes
- **No manual font-weight values**: All weights controlled via tokens

#### Layout requirements
- **Container-relative sizing**: Tile width = 100% of parent container
- **Multi-column support**: Must work correctly in CSS Grid or Flexbox layouts with 1-4 columns
- **No breakpoint logic inside atom**: Responsive behavior handled by parent grid, not tile itself

#### Tracking requirements
- **Click events must never send PII or full URLs**
- **Event payload**: `{ tile_id, tracking_key, mode, action: 'click' | 'cta_click' }`
- **No external URLs in tracking**: Use internal IDs only
- **Privacy-first**: All tracking data must be anonymizable

#### Agnostic design principles
- **No surface-specific logic**: Tile should work in any feed/grid context (YouTube, Shopify, KPI dashboard, etc.)
- **No hardcoded content**: All text, images, metrics come from data prop
- **No external dependencies**: Tile should not import from surface-specific modules
- **Reusable across surfaces**: Same tile atom used in multi21, caidence2, and future UIs

### Next step

Use this brief + legacy snapshot as input to **AITOM_INGEST** with:

```
atom_id: multi_feed_tile
brief: <summarize the above, referencing the snapshot path>
```

**Do not call AITOM_INGEST yourself**; this document is preparation only.

---

## Additional notes

### Differences from legacy implementation
1. **Token-based vs Tailwind**: Legacy uses Tailwind classes directly; new atom must use tokens
2. **Mode extensibility**: Legacy has 4 hardcoded variants; new atom should support future modes
3. **CTA support**: Legacy lacks explicit CTA; new atom includes it for product mode
4. **Tracking structure**: Legacy uses tool state; new atom uses event-based tracking
5. **Typography control**: Legacy uses Tailwind text utilities; new atom uses Roboto Flex axis tokens

### Migration considerations
- Existing Multi21 grids in agentflow can eventually consume this atom
- Atom should be backwards-compatible with legacy data shapes where possible
- Consider creating a data adapter/transformer for legacy → new format

### Future enhancements (out of scope for initial ingest)
- Video autoplay on hover
- Lazy loading for media
- Skeleton loading states
- Animation presets (entrance, exit, hover)
- Accessibility enhancements (ARIA labels, keyboard navigation)
