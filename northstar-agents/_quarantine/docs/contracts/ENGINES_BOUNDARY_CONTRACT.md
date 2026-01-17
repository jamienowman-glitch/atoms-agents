# Engines Boundary Contract

Defines the HTTP surface area the Agents Client interacts with.

## 1. Canvas Operations
- `GET /canvas/{canvas_id}/snapshot`
  - Returns: Full DOM/State.
- `GET /canvas/{canvas_id}/replay`
  - Returns: Event log.

## 2. Token Operations
- `GET /tokens/catalog`
  - Returns: `TokenCatalog` (schema definitions).
- `POST /tokens/set`
  - Body: `{ "canvas_id": "...", "token_path": "...", "value": ... }`
- `POST /tokens/batch_set`
  - Body: `{ "ops": [ ... ] }`

## 3. Feed Operations
- `GET /feeds`
  - Query: `?kind={kind}`
  - Returns: List of `FeedDefinition`.
- `POST /feeds/{kind}`
  - Body: `{ "name": "...", ... }`
  - Returns: `FeedDefinition`.
- `POST /feeds/{feed_id}:refresh`
  - Returns: Status.
- `GET /feeds/{feed_id}/items`
  - Query: `?limit=20&cursor=...`
  - Returns: `FeedItemsPage`.

## 4. Realtime
- `GET /sse/canvas/{canvas_id}` (Optional helper)
