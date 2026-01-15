# Multi-21 Feed Block Contract v0

 Canonical Builder Atom: "Feed Block / Tile Grid Renderer"

## A) Data Model

### Feed Configuration
- `feed.mode`: `feed` | `manual`

**If Feed Mode:**
- `feed.source.kind`: `youtube` | `shopify_products` | `shopify_collections` | `events` | `blog` | `brand_stories` | `mixed` | `tenant_media` | `generated` | `kpi` | `notifications`
- `feed.source.feed_id`: String (UUID) pointing to registry feed.
- `feed.query.limit`: Integer.
- `feed.query.sort`: `newest` | `featured` | `manual`.

**If Manual Mode:**
- `manual.items[]`: List of item references or inline definitions.

## B) Grid Controls
- `grid.cols_mobile`: Integer.
- `grid.cols_tablet`: Integer.
- `grid.cols_desktop`: Integer.
- `grid.gap_x`: Token/Value.
- `grid.gap_y`: Token/Value.
- `grid.tile_radius`: Token/Value.
- `grid.aspect_ratio`: `1:1` | `4:3` | `16:9` | `9:16`.

## C) Tile Controls
- `tile.variant`: `generic` | `product` | `kpi` | `text` | `video`
- `tile.show_title`: Boolean.
- `tile.show_meta`: Boolean.
- `tile.show_badge`: Boolean.
- `tile.show_cta_label`: Boolean.
- `tile.show_cta_arrow`: Boolean.
- `tile.primary_href`: URL/Link.
- `tile.secondary_href`: URL/Link.
- `tile.secondary_label`: String.
- `tile.utm.*`: Optional per-tile override.

## D) Engine Requirements
- **List Feeds**: Endpoint to list available feeds for the source selector.
- **Create Feed**: Capability to create new feeds from the UI.
- **Get Items**: Pagination support (limit, cursor).
- **Realtime**: SSE stream for `feed_updated` events to refresh the grid.
