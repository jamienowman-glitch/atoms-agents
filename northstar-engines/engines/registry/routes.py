from __future__ import annotations

import hashlib
import json
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, Request, Response
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from engines.common.error_envelope import error_response
from engines.common.identity import RequestContext, get_request_context
from engines.identity.auth import AuthContext, get_auth_context, require_tenant_membership
from engines.registry.models import RegistryEntry
from engines.registry.service import (
    AtomsPayload,
    ComponentRegistryService,
    ComponentsPayload,
    RegistrySpec,
    RegistrySpecsPayload,
    SystemRegistryService,
    RegistrySpecsPayload,
    SystemRegistryService,
    get_component_registry_service,
    get_system_registry_service,
)
from engines.registry.schemas.atelier import AtelierManifest, SurfaceDefinition, UIAtom

router = APIRouter(prefix="/registries", tags=["registry"])

def _require_membership(auth: AuthContext, context: RequestContext) -> None:
    try:
        require_tenant_membership(auth, context.tenant_id)
    except HTTPException as exc:
        error_response(
            code="auth.tenant_membership_required",
            message=str(exc.detail),
            status_code=exc.status_code,
            resource_kind="component_registry",
        )


def _resolve_auth_context(
    auth: AuthContext = Depends(get_auth_context),
) -> AuthContext:
    return auth


def _compute_etag(
    payload: BaseModel,
    exclude: set[str] | None = None,
) -> str:
    normalized = payload.model_dump(exclude=exclude)
    serialized = json.dumps(
        normalized,
        sort_keys=True,
        separators=(",", ":"),
        ensure_ascii=False,
    )
    digest = hashlib.sha256(serialized.encode("utf-8")).hexdigest()
    return f"\"{digest}\""


def _respond_with_etag(
    payload: BaseModel,
    request: Request,
    exclude: set[str] | None = None,
) -> Response:
    etag = _compute_etag(payload, exclude=exclude)
    if_none_match = request.headers.get("if-none-match")
    if if_none_match:
        for token in if_none_match.split(","):
            if token.strip() == etag:
                response = Response(status_code=304)
                response.headers["ETag"] = etag
                return response
    content = payload.model_dump()
    response = JSONResponse(content=content, status_code=200)
    response.headers["ETag"] = etag
    return response


@router.get("/components", response_model=ComponentsPayload)
def get_components(
    request: Request,
    context: RequestContext = Depends(get_request_context),
    auth: AuthContext = Depends(_resolve_auth_context),
    service: ComponentRegistryService = Depends(get_component_registry_service),
) -> Response:
    _require_membership(auth, context)
    payload = service.get_components(context)
    return _respond_with_etag(payload, request)


@router.get("/atoms", response_model=AtomsPayload)
def get_atoms(
    request: Request,
    context: RequestContext = Depends(get_request_context),
    auth: AuthContext = Depends(_resolve_auth_context),
    service: ComponentRegistryService = Depends(get_component_registry_service),
) -> Response:
    _require_membership(auth, context)
    payload = service.get_atoms(context)
    return _respond_with_etag(payload, request)


@router.get("/specs", response_model=RegistrySpecsPayload)
def get_registry_specs(
    request: Request,
    kind: str = Query(..., regex="^(atom|component|lens|token)$"),
    cursor: Optional[str] = Query(None),
    context: RequestContext = Depends(get_request_context),
    auth: AuthContext = Depends(_resolve_auth_context),
    service: ComponentRegistryService = Depends(get_component_registry_service),
) -> Response:
    _require_membership(auth, context)
    payload = service.list_specs(context, kind=kind, cursor=cursor)
    etag = _compute_etag(payload, exclude={"etag"})
    payload_with_etag = payload.model_copy(update={"etag": etag})
    return _respond_with_etag(payload_with_etag, request, exclude={"etag"})


@router.get("/specs/{spec_id}", response_model=RegistrySpec)
def get_registry_spec(
    spec_id: str,
    request: Request,
    context: RequestContext = Depends(get_request_context),
    auth: AuthContext = Depends(_resolve_auth_context),
    service: ComponentRegistryService = Depends(get_component_registry_service),
) -> Response:
    _require_membership(auth, context)
    spec = service.get_spec(context, spec_id)
    if not spec:
        error_response(
            code="component_registry.spec_not_found",
            message=f"Spec not found: {spec_id}",
            status_code=404,
            resource_kind="component_registry",
            details={"spec_id": spec_id},
        )
    return _respond_with_etag(spec, request)


@router.get("/namespaces", response_model=List[str])
def get_namespaces(
    request: Request,
    context: RequestContext = Depends(get_request_context),
    auth: AuthContext = Depends(_resolve_auth_context),
    service: SystemRegistryService = Depends(get_system_registry_service),
) -> List[str]:
    _require_membership(auth, context)
    return service.get_namespaces(context)


@router.get("/{namespace}", response_model=List[RegistryEntry])
def get_registry_entries(
    namespace: str,
    request: Request,
    context: RequestContext = Depends(get_request_context),
    auth: AuthContext = Depends(_resolve_auth_context),
    service: SystemRegistryService = Depends(get_system_registry_service),
) -> List[RegistryEntry]:
    _require_membership(auth, context)
    return service.list_entries(context, namespace)


@router.post("/{namespace}", response_model=RegistryEntry)
def upsert_registry_entry(
    namespace: str,
    entry: RegistryEntry,
    request: Request,
    context: RequestContext = Depends(get_request_context),
    auth: AuthContext = Depends(_resolve_auth_context),
    service: SystemRegistryService = Depends(get_system_registry_service),
) -> RegistryEntry:
    _require_membership(auth, context)
    return service.upsert_entry(context, namespace, entry)


@router.delete("/{namespace}/{key}", response_model=None)
def delete_registry_entry(
    namespace: str,
    key: str,
    request: Request,
    context: RequestContext = Depends(get_request_context),
    auth: AuthContext = Depends(_resolve_auth_context),
    service: SystemRegistryService = Depends(get_system_registry_service),
) -> Response:
    service.delete_entry(context, namespace, key)
    return Response(status_code=204)


@router.post("/harvest/atoms", response_model=None)
def harvest_atoms(
    atoms: List[UIAtom],
    request: Request,
    context: RequestContext = Depends(get_request_context),
    auth: AuthContext = Depends(_resolve_auth_context),
    service: ComponentRegistryService = Depends(get_component_registry_service),
) -> Response:
    """Bulk upsert UI Atoms from the Harvester."""
    _require_membership(auth, context)
    service.upsert_atoms(context, atoms)
    return Response(status_code=204)


@router.post("/harvest/surfaces", response_model=None)
def harvest_surfaces(
    surfaces: List[SurfaceDefinition],
    request: Request,
    context: RequestContext = Depends(get_request_context),
    auth: AuthContext = Depends(_resolve_auth_context),
    service: ComponentRegistryService = Depends(get_component_registry_service),
) -> Response:
    """Register available Tool Surfaces from the Harvester."""
    _require_membership(auth, context)
    service.register_surfaces(context, surfaces)
    return Response(status_code=204)


@router.post("/harvest", response_model=None)
def harvest_generic(
    manifests: List[AtelierManifest],
    request: Request,
    context: RequestContext = Depends(get_request_context),
    auth: AuthContext = Depends(_resolve_auth_context),
    service: ComponentRegistryService = Depends(get_component_registry_service),
) -> Response:
    """Bulk harvest generic Atelier Manifests (Canvases, Atoms, etc)."""
    _require_membership(auth, context)
    service.register_manifests(context, manifests)
    return Response(status_code=204)


@router.post("/atelier/harvest", response_model=None)
def harvest_atelier(
    manifests: List[AtelierManifest],
    request: Request,
    context: RequestContext = Depends(get_request_context),
    auth: AuthContext = Depends(_resolve_auth_context),
    service: ComponentRegistryService = Depends(get_component_registry_service),
) -> Response:
    """Bulk harvest Atelier Manifests (Explicit Endpoint)."""
    _require_membership(auth, context)
    service.register_manifests(context, manifests)
    return Response(status_code=204)
