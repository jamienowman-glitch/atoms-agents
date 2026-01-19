# Toolmap Template: Toolpop -> <ATOM NAME>

Tool Surface: Toolpop (Bottom Controller)
Tool Name: MULTI-21-COPY
Scope: `surfaceId: <surfaceId>`, `entityId: <entityId>`
Primary Wiring: <controller file> -> <connected block> -> <renderer>

---

Description:  this will be for copy similar to what Tiles is a high dynamic tool that then for this and then Tiles you can kind of use as a reference points for later on hopefully building all of the functionality that you would need in any further atom that will be a really end up being a combination of the two. 

This atom when added only adds ONE of the following A HEADLINE. A SUBTITLE. A BODY. 

To create documents rather than follow almost every other builder which ends up being not very controllable you would stack these where the next one on the canvas should inherit the same and of course be able to be overwritten but the same formatting so left a line centre right or justifie. 

You must be able to click into the Element to edit text.

In the tools we will split H2 | H3 | H4 | Body from STYLING: JUMBO | HEADLINE | SUBTITLE | TAGLINE | QUOTE | BODY| CAPTION

You MUST SET H1 AT THE PAGE LEVEL SETTINGS. 

JUMBO A preset for a size where the longest word / line takes up the entire width of the screen. 

Caption this would sit tightly under a photograph set to left the line on the edge of that image Element where you have three elements that could be model or skater name in extra bold inrobotoflex, trick or outfit in semibold and PHotographer in extra bold and then name in bold. 

Tagline: This will be in between JUMBO & HEAD LINE and able to highlight a word and sselect a colour. 




## Left Magnifier: LAYOUT (Blank Slot)
Right Magnifier: 
- UI: TOP SLIDER: H2 | H3 | H4 | Body 
Bottom Slider: JUMBO | HEADLINE | SUBTITLE | TAGLINE | QUOTE | BODY| CAPTION

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
