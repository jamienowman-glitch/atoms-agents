# Specs Registry Reality — 2026-01-07

## A) Engines registry reality
- **Endpoints (EXISTS)**: `engines/registry/routes.py` wires `GET /registry/components`, `/registry/atoms`, `/registry/specs?kind=atom|component|lens&cursor=...` and `/registry/specs/{id}`. Each route enforces tenant membership via `engines.registry.routes._require_membership`.
- **Storage backend (EXISTS)**: `ComponentRegistryRepository` (same file) routes every read/write through `TabularStoreService` in `engines/storage/routing_service.py` with `resource_kind="component_registry"`. Missing routing triggers `engines.common.error_envelope.missing_route_error`.
- **ETag handling (EXISTS)**: `_respond_with_etag` hashes `payload.model_dump()` with `hashlib.sha256` (see `engines/registry/routes.py:_compute_etag`) and honors `If-None-Match`, returning 304 with the same `ETag` header. `engines/registry/tests/test_registry_routes.py::test_components_etag_caching` validates the cycle.
- **Cursor handling (EXISTS)**: `ComponentRegistryService.list_specs` decodes base64 offsets via `_decode_cursor`, raises `cursor_invalid_error` on bad tokens or offsets past the record count, and encodes next cursor with `_encode_cursor`. `engines/registry/tests/test_registry_specs.py::test_specs_invalid_cursor_returns_envelope` asserts 410/canonical envelope.
- **Spec payloads (EXISTS)**: `RegistrySpec` (same file) requires `schema`, `defaults`, `controls`, `token_surface` and sorts results by `spec.id`. Fixtures `_builder_atom_spec()` and `_graphlens_spec()` in `engines/registry/tests/test_registry_specs.py` prove atom/lens records meet the shape. Real sample:
```json
{
  "id": "atom.builder.button",
  "kind": "atom",
  "version": 1,
  "schema": {"type":"object","properties":{"label":{"type":"string"},"style":{"type":"object"}}},
  "defaults": {"label":"Click me","style":{"color":"blue"}},
  "controls": {"/label":{"type":"text"}},
  "token_surface": ["/label","/style/color"],
  "metadata": {"title":"Builder button"}
}
```
Lens fixture (`lens.graphlens.builder`) similarly exposes `controls`, `defaults`, and a token_surface list for GraphLens guidance.
- **Restart resilience (EXISTS)**: `ComponentRegistryService` uses routed `TabularStoreService` so any route-backed backend (filesystem, Firestore, DynamoDB, Cosmos) is admissible; `test_registry_persistence` reloads a second `ComponentRegistryService` instance after saving to prove durability.

## B) Error envelope reality
- **Canonical envelope (EXISTS)**: `engines/common/error_envelope.py` defines `ErrorEnvelope`/`ErrorDetail` and helper `error_response()` that always wraps HTTPExceptions as `{"error": {...}}`.
- **Missing route (EXISTS)**: `TabularStoreService._resolve_adapter` raises `MissingRoutingConfig`, `ComponentRegistryRepository._tabular()` captures it and raises `missing_route_error` with `resource_kind="component_registry"`. Test payload example (`test_specs_missing_route_returns_envelope`):
```json
{
  "error": {
    "code": "component_registry.missing_route",
    "message": "No routing configured for component_registry",
    "http_status": 503,
    "gate": null,
    "action_name": null,
    "resource_kind": "component_registry",
    "details": {
      "resource_kind": "component_registry",
      "tenant_id": "t_registry",
      "env": "dev"
    }
  }
}
```
- **Invalid cursor (EXISTS)**: `cursor_invalid_error` raises with `code="component_registry.cursor_invalid"` and includes the malformed cursor in `details`. Test `test_specs_invalid_cursor_returns_envelope` confirms the 410 payload and details payload.
- **Spec-not-found (IMPLEMENTED)**: `/registry/specs/{id}` calls `error_response` with `code="component_registry.spec_not_found"` (404) when the repository returns `None`.
- **Leakage check (EXISTS)**: Error handlers registered in `engines.chat.service.http_transport.register_error_handlers` unwrap FastAPI exceptions so responses remain top-level `error`, avoiding FastAPI’s default `{"detail": ...}` wrappers (demonstrated by all tests instantiating `TestClient` with `register_error_handlers`).

## C) Agent Registry boundary safety
- **Existing API surface (EXISTS)**: `northstar-agents/src/northstar/engines_boundary/client.py::get_registry_components` already calls `GET /registry/components` with identity headers and raises `SafetyBlocked` on canonical envelopes (see `tests/engines_boundary/test_engines_boundary.py` verifying missing-route propagation). No current client references `/registry/specs`.
- **Card/schema prohibition (ENFORCED)**: Per brief, Agent Registry’s `src/northstar/registry/cards/**` and `schemas/**` remain untouched; they are read-only from Engines and unrelated to the spec endpoints in `northstar-engines`.

## D) UI usage reality
- **Local default (EXISTS)**: `packages/builder-registry/src/service.ts` defaults to shipped `SCHEMAS`/`SECTION_TEMPLATES` unless `NORTHSTAR_REMOTE_REGISTRY` is truthy. Remote fetch currently targets `/registry/components`.
- **Identity headers (EXISTS)**: Remote fetch calls `buildIdentityHeaders` from `@northstar/transport`, so requests include `Authorization` plus `X-Tenant-Id/X-Mode/X-Project-Id`.
- **Specs contract usage (MISSING)**: No UI code currently consumes `/registry/specs` or `/registry/atoms`; this repo still relies on `SCHEMAS` (see `docs/foundational/unification/WORK_UI-REGISTRY-06.md`). There is no `RegistryService` helper that understands `next_cursor` or spec payload sorting/controls/token_surface yet.
