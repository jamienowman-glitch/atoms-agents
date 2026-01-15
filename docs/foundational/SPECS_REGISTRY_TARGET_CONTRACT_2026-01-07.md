# Specs Registry Target Contract — 2026-01-07

## Endpoint surface
- `GET /registry/components` (already existing): returns `{version:int, components:[{id,version,schema?,defaults?,metadata?}]}` with ETag/304 semantics.
- `GET /registry/atoms`: returns `{version:int, atoms:[{id,version,schema?,defaults?,token_surface:[string]}]}` with the same ETag contract.
- `GET /registry/specs?kind=atom|component|lens&cursor=...`: paged listing that enforces `kind` (required) and optionally accepts a base64 cursor. Response shape:
  ```json
  {
    "specs": [RegistrySpec],
    "next_cursor": "base64-offset" | null,
    "etag": "sha256-hex"
  }
  ```
  - `RegistrySpec` (see schema below) must include stable fields for inspector/TokenSurface consumption.
  - `next_cursor` encodes the offset of the next page; clients must treat it as opaque and pass it back via `cursor`.
  - `ETag` is deterministic hash of the payload (sorted keys, compact JSON), and `If-None-Match` must trigger 304 when the computed hash matches.
- `GET /registry/specs/{id}`: returns a single `RegistrySpec` with the same ETag contract; 404 surfaces `component_registry.spec_not_found` (optional/TBD but recommended) in canonical envelope.

## `RegistrySpec` schema (P0 fields)
- Common required fields for every kind:
  - `id`: string
  - `kind`: `"atom" | "component" | "lens"`
  - `version`: integer (incremental, persisted via routed storage)
  - `schema`: object (never null; describes editable properties/state)
  - `defaults`: object (explicit defaults; non-applicable groups must expose `{"status":"NA","reason":"…"}` rather than dropping the key)
  - `controls`: object (UI controls for inspector/token_surface mapping; not optional)
  - `token_surface`: array of string paths (empty list allowed when no tokens)
  - `metadata`: object (freeform, used by inspectors; include tile/title/desc)
- Additional expectations per kind:
  - `atom`: `token_surface` describes editable tokens, `controls`/`schema` describe tokenized fields.
  - `component`: includes `schema`/`defaults` for editable nested atoms; `token_surface` is optional but recommended when components expose tokens.
  - `lens`: must expose `schema`, `defaults`, `controls`; `token_surface` is optional (only filled when state patches rely on tokenized data).

## Routing, storage, and resilience
- All persistence uses `component_registry` routed stores via `TabularStoreService`. Missing routing must raise `component_registry.missing_route`.
- Sorting must be stable (sort by `spec.id` as currently implemented); deterministic ordering ensures ETag only changes when data changes.
- Cursor encoding: offset is base64 URL-safe encoded integer (`encode_cursor`/`decode_cursor`). Invalid cursor values (non-numeric or offsets beyond length) trigger `cursor_invalid_error` with code `component_registry.cursor_invalid` and HTTP 410.
- Clients must treat `next_cursor=null` as end-of-list.

## Canonical error envelopes
- **Missing route / 503**
  ```json
  {
    "error": {
      "code": "component_registry.missing_route",
      "message": "No routing configured for component_registry",
      "http_status": 503,
      "gate": null,
      "resource_kind": "component_registry",
      "details": {"resource_kind":"component_registry","tenant_id":"t","env":"dev"}
    }
  }
  ```
- **Invalid cursor / 410**
  ```json
  {
    "error": {
      "code": "component_registry.cursor_invalid",
      "message": "Cursor invalid or expired: <token>",
      "http_status": 410,
      "gate": null,
      "resource_kind": "component_registry",
      "details": {"cursor":"<token>"}
    }
  }
  ```
- **Optional spec not found / 404**: `code=component_registry.spec_not_found`, `http_status=404`, include `details.spec_id`.

## ETag + caching expectations
- Every successful `GET` returns `ETag` computed over the normalized payload (keys sorted, separators `(",",":")`, JSON encoded in UTF-8) so repeated reads with unchanged data lead to consistent hashes.
- Clients sending `If-None-Match` must receive 304 with the `ETag` header and no body whenever the server-side hash matches.

## Cursor + paging rules
- Page size is fixed (currently 50). Servers return at most one page; clients rely on `next_cursor` to fetch additional pages.
- Cursor semantics rely on the sorted order (`spec.id` lexicographic). Changing sort order invalidates cached cursors/resets ETag.
