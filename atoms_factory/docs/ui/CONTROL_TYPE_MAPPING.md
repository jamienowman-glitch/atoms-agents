# Control Type Mapping

This document explicitly maps Token Schema "types" to UI Controls in the Builder Inspector.
Regressions to "mystery textareas" for these types are STRICTLY PROHIBITED.

## Mapping Rules

| Data Type | Control Metadata | UI Widget | Notes |
| :--- | :--- | :--- | :--- |
| `boolean` | - | **Toggle** | Default ON/OFF switch. |
| `number` | `min`, `max`, `step` | **Slider** | Essential for opacity, radius, gap, grid cols. |
| `string` | `enum: [...]` | **Select / Dropdown** | For modes, variants, fonts. |
| `string` | `format: "color"` | **Color Picker** | Must support hex/rgba/gradients. |
| `string` | `kind: "url"` | **Asset Picker** | Opens media library or link picker. |
| `string` | `content.text` | **Inline Edit** | Text editing happens on-canvas. Inspector shows "Edit in Canvas". |
| `object` | `x`, `y` | **Coordinate Input** | Small number pair. |

## Explicit Prohibitions

- **No Textareas for JSON**: Never ask user to paste JSON blob.
- **No Textareas for Vectors**: Vector paths must be edited via tool or asset picker.
- **No Text Input for Enums**: If valid values are `fixed|absolute`, use a Select.

## Component Specifics

### Multi-21
- `grid.cols_*`: Range Slider (1-12).
- `grid.gap_*`: Slider (px/rem).
- `tile.variant`: Select (Card visuals).
- `tile.show_*`: Toggles.

### Typography
- `font.family`: Font Picker (Visual preview).
- `weight`: Slider/Select (100-900).
