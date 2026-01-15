# surface_logo_centerpiece – Behaviour: Display

## Logo Display Behavior

### Asset Loading
- **Primary**: Load logo image/SVG from provided asset_id
- **Fallback**: Display brand name text if asset fails to load
- **Loading State**: Show placeholder or skeleton while loading
- **Error State**: Display fallback text if asset load fails

### Sizing Behavior
- **Responsive**: Logo scales based on viewport and header variant
- **Aspect Ratio**: Maintain logo aspect ratio (no distortion)
- **Max Width**: Tokenized max-width prevents oversized logos
- **Max Height**: Tokenized max-height maintains header proportions

### Centering Behavior
- **Horizontal**: Always centered in header
- **Vertical**: Vertically centered within header height
- **Preserved**: Centering maintained even when adjacent elements change

### Interaction (Non-Interactive)
- **No Click**: Logo is display-only (not clickable by default)
- **Optional Link**: Can be wrapped in link to homepage (configurable)
- **No Hover State**: No visual change on hover (unless linked)

### Truncation/Overflow
- **No Truncation**: Logo image never truncated
- **Scaling**: Logo scales down if exceeds max dimensions
- **Fallback Text**: Truncates with ellipsis if too long

## Implementation Notes
- Logo loading handled asynchronously
- Fallback text ensures content always visible
- Aspect ratio preserved via CSS object-fit: contain
- Centering uses flexbox alignment
- Optional link wrapper for homepage navigation
