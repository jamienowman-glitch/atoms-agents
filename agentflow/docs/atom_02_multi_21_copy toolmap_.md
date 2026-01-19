# Toolmap Template: Toolpop -> <ATOM NAME>

Tool Surface: Toolpop (Bottom Controller)
Tool Name: <ATOM NAME>
Scope: `surfaceId: <surfaceId>`, `entityId: <entityId>`
Primary Wiring: <controller file> -> <connected block> -> <renderer>

---

## Left Magnifier: LAYOUT (Blank Slot)
Right Magnifier: <Tool 1>
- UI: <controls>
- Tool IDs: <tool ids>
- Renderer mapping: <what it drives>
- Pseudocode:
  ```ts
  // TODO: wire for this atom
  ```

Right Magnifier: <Tool 2>
- UI: <controls>
- Tool IDs: <tool ids>
- Renderer mapping: <what it drives>
- Pseudocode:
  ```ts
  // TODO: wire for this atom
  ```

Right Magnifier: <Tool 3>
- UI: <controls>
- Tool IDs: <tool ids>
- Renderer mapping: <what it drives>
- Pseudocode:
  ```ts
  // TODO: wire for this atom
  ```

---

## UI Atom: Floating + Button
- Purpose: Add new atoms to the canvas.
- Current behavior: <how it behaves today>
- Target behavior: tap to open add-menu; long-press for quick categories; optional “column” insert.
- Data/Events:
  - UI event: `onAddAtom()`
  - Payload: `{ atomType, insertAfterId, columnSpan?, category? }`
- Notes:
  - Distinct from tile grid columns. This is page layout composition.
  - Keep add-menu lightweight; categories optional until atom list grows.

---

## UI Atom: SEO / Meta Flip Button
- Purpose: Flip the atom to its metadata / tracking side.
- Current behavior: <how it behaves today>
- Data/Events:
  - UI event: `onFlipAtom()` (toggle front/back)
  - Payload: `{ atomId, view: 'front' | 'back' }`
- Notes:
  - Atom-level only (page-level SEO lives elsewhere).

---

## UI Atom: Inline Copy Edit
- Purpose: Edit copy directly on-canvas (title, subtitle, body, CTA, etc).
- Current behavior: <how it behaves today>
- Data/Events:
  - UI event: `onEditCopy()`
  - Payload: `{ atomId, field, value }`
- Notes:
  - Use per-atom copy targets; avoid mixing with metadata tools.

---

## Left Magnifier: FONT (Stable)
Right Magnifier: Size
- Tool IDs: `typo.size_desktop`, `typo.size_mobile`
- Renderer mapping: `--multi-font-size` (or equivalent) for titles/body.

Right Magnifier: Font
- Tool IDs: `typo.family`
- Renderer mapping: `--multi-font-family` (or equivalent) and font resolver.

Right Magnifier: Tune
- Tool IDs: `typo.weight`, `typo.width`, `typo.slant`
- Renderer mapping: `font-variation-settings` / italic fallback.

---

## Left Magnifier: TYPE (Stable)
Right Magnifier: Align
- Tool IDs: `typo.align`
- Renderer mapping: `--multi-text-align` + inline alignment for row stacks.

Right Magnifier: Spacing
- Tool IDs: `typo.tracking`, `typo.line_height`
- Renderer mapping: `letter-spacing` + `line-height` vars.

Right Magnifier: Vertical
- Tool IDs: `typo.vert`
- Renderer mapping: `justify-content` for vertical stacking containers.

---

## Left Magnifier: COLOUR (Stable)
Right Magnifier: Color
- Targets & Tool IDs:
  - Block: `style.block_bg`
  - Background: `style.bg`
  - Text (Fill): `style.text`
  - Background (Outline): `style.border_color`, `style.border_width`
  - Text (Outline): `style.text_stroke_color`, `style.text_stroke_width`
- Renderer mapping: background, text color, borders, text stroke.

Right Magnifier: FX
- Tool IDs: `style.opacity`, `style.blur`
- Renderer mapping: `opacity` + `backdrop-filter` (or equivalent).

---

## Content / Settings Mode (Optional)
- Omit for generic atoms.
- If used: list content categories, strategy tools, and renderer mapping.
