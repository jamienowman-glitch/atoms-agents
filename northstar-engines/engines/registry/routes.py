from __future__ import annotations

import hashlib
import json
from typing import List, Optional, Any, Dict

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


@router.get("/entries", response_model=List[RegistryEntry])
def list_all_entries(
    request: Request,
    namespace: Optional[str] = Query(None),
    context: RequestContext = Depends(get_request_context),
    auth: AuthContext = Depends(_resolve_auth_context),
    sys_service: SystemRegistryService = Depends(get_system_registry_service),
    comp_service: ComponentRegistryService = Depends(get_component_registry_service),
) -> List[RegistryEntry]:
    """List all registry entries. optionally filtered by namespace.
    
    If namespace is NOT provided, returns a flat list of EVERYTHING (Muscles, Connectors, Agents, Atoms).
    Atoms are mapped to RegistryEntry format.
    """
    _require_membership(auth, context)
    
    results: List[RegistryEntry] = []
    
    # 1. System Registry Items
    # If namespace provided, just get that.
    # If not, iterate known system namespaces.
    
    target_namespaces = [namespace] if namespace else ["muscles", "connectors", "agents", "firearms", "kpis"]
    
    # If namespace is strictly 'atoms', skip system registry check (unless we want to map it there?)
    # But usually atoms are in ComponentRegistry.
    
    for ns in target_namespaces:
        if ns == "atoms": continue
        entries = sys_service.list_entries(context, ns)
        results.extend(entries)

    # 2. Component Registry Items (Atoms)
    # Only if namespace is None (all) or "atoms"
    if namespace is None or namespace == "atoms":
        atoms_payload = comp_service.get_atoms(context)
        for atom in atoms_payload.atoms:
            # Map AtomSpec to RegistryEntry
            label = atom.id
            # Try to get label from tokens if possible, strictly atom spec doesn't have label in metadata always?
            # It seems our seed script puts it in metadata.
            # AtomSpec definition: id, version, schema, defaults, token_surface. 
            # It allows extra fields (model_config="allow").
            
            # Access generic dict approach if fields missing
            atom_dict = atom.model_dump()
            metadata = atom_dict.get("metadata", {})
            name = metadata.get("label", atom.id)
            
            entry = RegistryEntry(
                id=atom.id, # We keep ID as is (e.g. "typo.size")
                namespace="atoms",
                key=atom.id,
                name=name,
                config={
                    "defaults": atom.defaults,
                    "schema": atom.schema,
                    "token_surface": atom.token_surface
                },
                enabled=True,
                tenant_id=context.tenant_id,
                # Default atoms to Demo or Concept?
                maturity="production_lite" # As per user goal "production_lite"
            )
            results.append(entry)

    # sort by ID
    results.sort(key=lambda x: x.id)
    return results


class EntryUpdate(BaseModel):
    maturity: Optional[str] = None
    config: Optional[Dict[str, Any]] = None
    enabled: Optional[bool] = None


@router.patch("/entries/{entry_id}", response_model=RegistryEntry)
def update_registry_entry(
    entry_id: str,
    payload: EntryUpdate,
    request: Request,
    context: RequestContext = Depends(get_request_context),
    auth: AuthContext = Depends(_resolve_auth_context),
    sys_service: SystemRegistryService = Depends(get_system_registry_service),
) -> RegistryEntry:
    """Update a registry entry (System Registry Only)."""
    _require_membership(auth, context)
    
    # 1. Parse ID to find namespace/key
    # System IDs are usually "namespace::key"
    if "::" not in entry_id:
        # Check if it's an atom (no ::). Atoms are immutable via this endpoint for now.
        error_response(
            code="registry.update_not_supported",
            message="Direct update not supported for this entry type (missing namespace prefix).",
            status_code=400,
            resource_kind="component_registry"
        )
    
    namespace, key = entry_id.split("::", 1)
    
    # 2. Get existing
    existing = sys_service.repo.get_entry(context, namespace, key)
    if not existing:
        error_response(
            code="registry.entry_not_found",
            message=f"Entry not found: {entry_id}",
            status_code=404,
            resource_kind="component_registry"
        )
        
    # 3. Apply updates
    current_entry = RegistryEntry.model_validate(existing)
    
    if payload.maturity is not None:
        try:
             # Validate enum
             current_entry.maturity = payload.maturity
        except ValueError:
             pass # let pydantic handle validation on upsert or ignore

    if payload.config is not None:
        # Deep merge? Or replace? User said "toggled... backend saves state". 
        # Usually PATCH implies partial update.
        # But payload.config is a dict. Let's do a merge for top-level keys.
        current_entry.config.update(payload.config)
        
    if payload.enabled is not None:
        current_entry.enabled = payload.enabled
        
    # 4. Save
    return sys_service.upsert_entry(context, namespace, current_entry)

