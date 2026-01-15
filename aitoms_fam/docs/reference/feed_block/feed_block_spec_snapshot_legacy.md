# Feed Block Spec – Legacy Snapshot (Agentflow)

**Created**: 2025-12-03  
**Purpose**: Reference snapshot of the existing "feed block" / tile implementation in the agentflow UI factory repo.

---

## Overview

The legacy implementation uses a **Multi²¹ block system** that serves as a flexible, grid-based tile/card renderer. Each block can display different content types (modes) and is designed to work within a 24-unit grid layout system.

### Core Concept
- **Block = Cell**: Each "block" is a single tile/card in a multi-column grid
- **Mode-driven rendering**: The block's appearance and behavior change based on a `variant` property
- **Grid-aware**: Blocks specify their span for desktop (1-12) and mobile (1-6) layouts
- **Reusable**: Same component structure supports multiple content types

---

## Supported Modes

The legacy system supports four primary tile variants:

### 1. **Generic** (default)
- Basic tile with minimal styling
- Used as fallback/placeholder

### 2. **Product**
- Product card display
- Intended for e-commerce/Shopify integration
- Supports thumbnail, title, metadata

### 3. **KPI**
- Key Performance Indicator display
- Metric value + label presentation
- Used for dashboard/analytics views

### 4. **Text**
- Simple text-based tile
- Minimal media, focus on typography

---

## Behavior

### Click-through
- All tiles are clickable by default
- Click behavior controlled via `onSelect` callback pattern
- Example: `FileCard` component uses `onSelect?.(id)` pattern

### Drag & Drop
- Tiles support drag-and-drop functionality
- Payload includes: `type`, `id`, `title`, and optional metadata
- Uses standard HTML5 drag API (`draggable`, `onDragStart`)

### Hover States
- Minimal hover effects in legacy implementation
- Focus on functional interactions over decorative animations

### Strategy Lock
- Individual tiles can be "locked" to prevent modification
- Controlled via `TilePopup` component
- Binary state: locked/unlocked

---

## Layout Rules

### Grid System
- **Desktop**: 24-unit grid, blocks span 1-12 units
- **Mobile**: 6-unit grid, blocks span 1-6 units
- Default desktop span: 6 (= 1/4 width on 24-grid)
- Default mobile span: 2 (= 1/3 width on 6-grid)

### Aspect Ratios
- **Square**: `aspect-square` (1:1)
- **Portrait**: `aspect-[3/4]` (3:4)
- **Landscape**: `aspect-video` (16:9)

### Responsive Behavior
- Blocks reflow based on viewport width
- Mobile/desktop spans controlled independently
- No fixed pixel widths, all relative to grid

---

## Data Shape (Legacy)

Based on existing component props:

### Multi21Block
```typescript
{
  blockId: string;           // Unique identifier
  spanDesktop: number;       // 1-12 grid units
  spanMobile: number;        // 1-6 grid units
  variant: 'generic' | 'product' | 'kpi' | 'text';
}
```

### FileCard (Product/Media variant)
```typescript
{
  id: string;
  title: string;
  thumbnail?: string;        // Image URL
  meta?: string;             // Subtitle/description
  onSelect?: (id: string) => void;
  draggablePayload?: Record<string, unknown>;
}
```

### VideoThumb (Video variant)
```typescript
{
  src: string;               // Video URL
  aspectRatio: 'square' | 'portrait' | 'landscape';
}
```

---

## Tracking

### Current Implementation
- Tool state tracking via `ToolControlContext`
- Tracks: span settings, variant selection, lock state
- Uses structured target format:
  ```typescript
  {
    surfaceId: 'multi21.block',
    scope: 'block',
    entityId: blockId,
    toolId: 'block.setSpanDesktop'
  }
  ```

### Privacy Considerations
- No PII tracking observed in current implementation
- IDs are internal, not user-identifiable
- No URL tracking in drag payloads

---

## Styling

### Typography
- **Font**: Roboto Flex (variable font)
- **Sizes**: 
  - Title: `text-sm font-semibold`
  - Subtitle: `text-xs text-neutral-500`
  - Labels: `text-xs text-neutral-600 dark:text-neutral-300`

### Colors
- **Background**: `bg-white dark:bg-neutral-900`
- **Borders**: `border-neutral-200 dark:border-neutral-800`
- **Accents**: `bg-neutral-900 text-white` (selected state)
- **Video overlay**: `bg-black/60`

### Spacing
- **Card padding**: `p-3` or `p-4`
- **Gap between elements**: `gap-2`
- **Border radius**: `rounded-lg` or `rounded-md`

### Design Philosophy
- Minimal, flat design
- No gradients or neon colors
- Dark mode support throughout
- Focus on content over decoration

---

## Source Files

The following files were used to create this snapshot:

- [`components/multi21/Multi21Block.tsx`](file:///Users/jaynowman/dev/agentflow/components/multi21/Multi21Block.tsx) – Core block component with variant switching
- [`components/multi21/VideoThumb.tsx`](file:///Users/jaynowman/dev/agentflow/components/multi21/VideoThumb.tsx) – Video tile implementation
- [`components/files/FileCard.tsx`](file:///Users/jaynowman/dev/agentflow/components/files/FileCard.tsx) – Product/media card pattern
- [`components/multi21/TilePopup.tsx`](file:///Users/jaynowman/dev/agentflow/components/multi21/TilePopup.tsx) – Strategy lock control
- [`docs/00_DEV_PLAYBOOK.md`](file:///Users/jaynowman/dev/agentflow/docs/00_DEV_PLAYBOOK.md) – Design system rules

---

## Known Limitations

1. **Hardcoded variants**: Only 4 modes supported, not extensible
2. **No CTA support**: Product mode lacks explicit call-to-action buttons
3. **Limited KPI rendering**: No dedicated KPI component found
4. **No ecom integration**: Product mode is UI-only, no Shopify connector
5. **Manual aspect ratio**: Video aspect must be specified, not auto-detected

---

## Next Steps (for aitoms_fam migration)

This snapshot should be used as a **reference only**. The new `multi_feed_tile` atom should:

1. ✅ Support all existing modes (image, video, kpi, product)
2. ✅ Add extensibility for future content types
3. ✅ Implement proper CTA support for product mode
4. ✅ Use token-based styling (no hardcoded Tailwind classes)
5. ✅ Maintain grid-agnostic design (works in any column layout)
6. ✅ Preserve tracking structure but use agnostic IDs
7. ✅ Keep typography limited to Roboto Flex with axis tokens
