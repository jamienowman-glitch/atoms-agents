# surface_logo_centerpiece – Icons: Logo Asset

## Logo Asset Specification

### Asset Types
- **SVG**: Preferred for scalability
- **PNG**: Fallback for raster logos
- **WebP**: Modern format for optimized loading

### Asset Paths
- **Asset ID**: References logo in asset library
- **Path Pattern**: `/assets/logos/{asset_id}.{ext}`
- **Theme Variants**: `{asset_id}_dark.svg`, `{asset_id}_light.svg`

### Sizing
- **Max Width (Desktop)**: 200px (tokenized)
- **Max Width (Tablet)**: 150px (tokenized)
- **Max Width (Mobile)**: 120px (tokenized)
- **Max Height**: 40px (standard header), 32px (micro header)
- **Aspect Ratio**: Preserved (no distortion)

### Colour/Theme
- **Dark Theme**: Use light/white logo variant
- **Light Theme**: Use dark/black logo variant
- **Monochrome**: Single-colour logos preferred for headers
- **Full Colour**: Supported if brand requires

### Loading States
- **Placeholder**: Empty space or skeleton while loading
- **Error**: Fallback to brand name text
- **Alt Text**: Brand name for accessibility

## Exposed Tokens
- `logo_max_width_desktop`: 200px
- `logo_max_width_tablet`: 150px
- `logo_max_width_mobile`: 120px
- `logo_max_height_standard`: 40px
- `logo_max_height_micro`: 32px

## Implementation Notes
- Use CSS object-fit: contain to preserve aspect ratio
- Lazy load logo images for performance
- Provide multiple formats for browser compatibility
- Ensure logo meets minimum contrast requirements
- Alt text required for accessibility
