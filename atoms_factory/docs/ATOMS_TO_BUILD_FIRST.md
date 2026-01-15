# Atoms to Build First

The following canonical Builder atoms are prioritized for the initial rollout. They must strictly adhere to the `Token Contract v1`.

## 1. Multi-21 Feed Block
**Role**: Feed Block / Tile Grid Renderer
**Contract**: `MULTI21_FEED_CONTRACT_v0.md`
**Key Tokens**:
- `feed.*` (mode, source, query)
- `grid.*` (cols, gap, radius, aspect_ratio)
- `tile.*` (variant, toggles, links)

## 2. Text Block
**Role**: Universal text content (Headings, Body, Quotes).
**Key Tokens**:
- `typography.*` (slots: base, title, subtitle, body, quote)
- `content.text`

## 3. Button Block
**Role**: Action triggers / Links.
**Key Tokens**:
- `button.*` (label, href, variant, icon)
- `style.*` (rendering)

## 4. Media Block
**Role**: Images and Video.
**Key Tokens**:
- `media.*` (src, type, fit, aspect_ratio)
- `media.filter.*`

## 5. Guides Block
**Role**: FAQ, How-To, Profile, EEAT.
**Key Tokens**:
- `faq.*`, `howto.*`, `profile.*`
- `schema.enabled`

## 6. Vector / Doodle Block
**Role**: Freehand or shape-based vector graphics.
**Key Tokens**:
- `vector.*` (paths, stroke, fill, roughness)
