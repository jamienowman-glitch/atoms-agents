# Toolmap: Toolpop -> Multi-21 Tile

Tool Surface: Toolpop (Bottom Controller)
Tool Name: Multi-21 Tile
Scope: `surfaceId: "multi21.designer"`, `entityId: <activeBlockId>`
Primary Wiring: `components/multi21/BottomControlsPanel.tsx` -> `components/multi21/ConnectedBlock.tsx` -> `components/multi21/Multi21.tsx`

---

## Left Magnifier: LAYOUT
Right Magnifier: Grid (Density)
- UI: Col count + Total Items sliders.
- Tool IDs:
  - `grid.cols_desktop` / `grid.cols_mobile`
  - `feed.query.limit_desktop` / `feed.query.limit_mobile`
- Multi-21 mapping:
  - `grid.cols_*` -> `gridTemplateColumns` via `--grid-cols` in `Multi21`.
  - `feed.query.limit_*` -> item count used by `ConnectedBlock` (`generateItems`).
- Pseudocode:
  ```ts
  const [colsDesktop] = useToolState({ toolId: 'grid.cols_desktop' })
  const [itemsDesktop] = useToolState({ toolId: 'feed.query.limit_desktop' })
  <Multi21 gridColsDesktop={colsDesktop} itemsDesktop={itemsDesktop} />
  ```

Right Magnifier: Space
- UI: Horizontal gap (X), Vertical gap (Y) sliders.
- Tool IDs:
  - `grid.gap_x_desktop` / `grid.gap_x_mobile`
  - `grid.gap_y_desktop` / `grid.gap_y_mobile`
- Multi-21 mapping:
  - `gap_x` -> `columnGap` via `--gap-x`.
  - `gap_y` -> `rowGap` via `--gap-y`.
- Pseudocode:
  ```ts
  const [gapXDesktop] = useToolState({ toolId: 'grid.gap_x_desktop' })
  const [gapYDesktop] = useToolState({ toolId: 'grid.gap_y_desktop' })
  <Multi21 gridGapXDesktop={gapXDesktop} gridGapYDesktop={gapYDesktop} />
  ```

Right Magnifier: Shape
- UI: Aspect ratio + Corner radius sliders.
- Tool IDs:
  - `grid.aspect_ratio`
  - `grid.tile_radius_desktop` / `grid.tile_radius_mobile`
- Multi-21 mapping:
  - `grid.aspect_ratio` -> `aspectClass` applied to the card wrapper (`.multi21-card`).
  - `grid.tile_radius_*` -> `--radius` used by `.multi21-card` and `.multi21-card-image`.
- Pseudocode:
  ```ts
  const [aspectRatio] = useToolState({ toolId: 'grid.aspect_ratio' })
  const [radiusDesktop] = useToolState({ toolId: 'grid.tile_radius_desktop' })
  <Multi21 gridAspectRatio={aspectRatio} gridTileRadiusDesktop={radiusDesktop} />
  ```

---

## Left Magnifier: FONT
Right Magnifier: Size
- UI: Base size slider.
- Tool IDs:
  - `typo.size_desktop` / `typo.size_mobile`
- Multi-21 mapping:
  - `--multi-font-size` applied to `.multi21-typo-target h3/p`.
- Pseudocode:
  ```ts
  const [fontSizeDesktop] = useToolState({ toolId: 'typo.size_desktop' })
  <Multi21 fontSizeDesktop={fontSizeDesktop} />
  ```

Right Magnifier: Font
- UI: Family buttons (Sans/Serif/Slab/Mono).
- Tool IDs:
  - `typo.family`
- Multi-21 mapping:
  - `typo.family` -> `getEffectiveFont()` -> `--multi-font-family`.
- Pseudocode:
  ```ts
  const [fontFamily] = useToolState({ toolId: 'typo.family' })
  <Multi21 fontFamily={fontFamily} />
  ```

Right Magnifier: Tune
- UI: Weight, Width, Slant sliders.
- Tool IDs:
  - `typo.weight`, `typo.width`, `typo.slant`
- Multi-21 mapping:
  - `font-variation-settings` via `--multi-font-variations`.
  - Slant applies `font-style: italic` for non-flex families.
- Pseudocode:
  ```ts
  const [axisWeight] = useToolState({ toolId: 'typo.weight' })
  const [axisWidth] = useToolState({ toolId: 'typo.width' })
  const [axisSlant] = useToolState({ toolId: 'typo.slant' })
  <Multi21 axisWeight={axisWeight} axisWidth={axisWidth} axisSlant={axisSlant} />
  ```

---

## Left Magnifier: TYPE
Right Magnifier: Align
- UI: Left / Center / Right / Justify buttons.
- Tool IDs:
  - `typo.align`
- Multi-21 mapping:
  - `--multi-text-align` applied to `.multi21-typo-target`.
  - Inline line stacks use `inlineJustify` (aligns inline rows).
- Pseudocode:
  ```ts
  const [textAlign] = useToolState({ toolId: 'typo.align' })
  <Multi21 textAlign={textAlign} />
  ```

Right Magnifier: Spacing
- UI: Tracking + Leading sliders.
- Tool IDs:
  - `typo.tracking` (letter spacing)
  - `typo.line_height`
- Multi-21 mapping:
  - `--multi-letter-spacing` (`tracking / 100` -> em in `Multi21`).
  - `--multi-line-height` used on typography blocks.
- Pseudocode:
  ```ts
  const [tracking] = useToolState({ toolId: 'typo.tracking' })
  const [lineHeight] = useToolState({ toolId: 'typo.line_height' })
  <Multi21 letterSpacing={tracking} lineHeight={lineHeight} />
  ```

Right Magnifier: Vertical
- UI: Top / Center / Bottom buttons.
- Tool IDs:
  - `typo.vert`
- Multi-21 mapping:
  - `--multi-vert-align` -> `.multi21-content { justify-content: var(--multi-vert-align); }`.
  - Note: compact content blocks force `justify-content: flex-start` to keep tight stacks.
- Pseudocode:
  ```ts
  const [verticalAlign] = useToolState({ toolId: 'typo.vert' })
  <Multi21 verticalAlign={verticalAlign} />
  ```

---

## Left Magnifier: COLOUR
Right Magnifier: Color
- UI: Color ribbon + target selector + Fill/Outline toggle.
- Targets & Tool IDs:
  - Block: `style.block_bg` (block wrapper background)
  - Background: `style.bg` (tile background)
  - Text (Fill): `style.text`
  - Background (Outline): `style.border_color` + `style.border_width`
  - Text (Outline): `style.text_stroke_color` + `style.text_stroke_width`
- Multi-21 mapping:
  - `--style-bg`, `--style-text`, `--style-border-color`, `--style-border-width`.
  - `-webkit-text-stroke` from `--style-text-stroke-*`.
- Pseudocode:
  ```ts
  const [styleBgColor] = useToolState({ toolId: 'style.bg' })
  const [styleTextColor] = useToolState({ toolId: 'style.text' })
  <Multi21 styleBgColor={styleBgColor} styleTextColor={styleTextColor} />
  ```

Right Magnifier: FX
- UI: Opacity + Blur sliders.
- Tool IDs:
  - `style.opacity`, `style.blur`
- Multi-21 mapping:
  - Applied on `.multi21-card, .multi21-content` as `opacity` and `backdrop-filter`.
- Pseudocode:
  ```ts
  const [styleOpacity] = useToolState({ toolId: 'style.opacity' })
  const [styleBlur] = useToolState({ toolId: 'style.blur' })
  <Multi21 styleOpacity={styleOpacity} styleBlur={styleBlur} />
  ```

---

## Content / Settings Mode (Gear Icon)
This is tile-specific content wiring (not part of the design-mode magnifiers).
- Content category -> `tile.variant` + `content.feed_source_index` + defaults for `grid.cols_desktop` / `feed.query.limit_desktop` / `grid.aspect_ratio`.
- Renderer mapping:
  - `tile.variant` selects Multi-21 card layout branch (product, youtube, events, etc).
  - `content.feed_source_index` selects seed feed in `ConnectedBlock`.
