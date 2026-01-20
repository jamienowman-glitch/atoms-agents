from __future__ import annotations

import base64
import binascii
from typing import Any, Dict, List, Literal, Optional

from pydantic import BaseModel, ConfigDict, Field, ValidationError

from engines.common.error_envelope import cursor_invalid_error, error_response
from engines.common.identity import RequestContext
from engines.registry.models import RegistryEntry
from engines.registry.repository import ComponentRegistryRepository, SystemRegistryRepository

SpecKind = Literal["atom", "component", "lens", "graphlens", "canvas"]


class ComponentSpec(BaseModel):
    """Lightweight descriptor for a registered component."""

    id: str
    version: int
    schema: Optional[Dict[str, Any]] = None
    defaults: Optional[Dict[str, Any]] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)

    model_config = ConfigDict(extra="allow")


class AtomSpec(BaseModel):
    """Definition of a registered atom with token surfaces."""

    id: str
    version: int
    schema: Optional[Dict[str, Any]] = None
    defaults: Optional[Dict[str, Any]] = None
    token_surface: List[str] = Field(default_factory=list)

    model_config = ConfigDict(extra="allow")


class ComponentsPayload(BaseModel):
    """Response payload for /registry/components."""

    version: int
    components: List[ComponentSpec]


class AtomsPayload(BaseModel):
    """Response payload for /registry/atoms."""

    version: int
    atoms: List[AtomSpec]


class RegistrySpec(BaseModel):
    """Full descriptor for a registry spec."""

    id: str
    kind: SpecKind
    version: int
    schema: Dict[str, Any]
    defaults: Dict[str, Any]
    controls: Dict[str, Any]
    token_surface: List[str]
    metadata: Dict[str, Any] = Field(default_factory=dict)

    model_config = ConfigDict(extra="allow")


class RegistrySpecsPayload(BaseModel):
    """Response for /registry/specs listings."""

    specs: List[RegistrySpec]
    next_cursor: Optional[str] = None
    version: int = 0
    etag: Optional[str] = None

    model_config = ConfigDict(extra="allow")


class ComponentRegistryService:
    """Service exposing registry snapshots with deterministic ordering."""

    SPEC_KINDS = {"atom", "component", "lens", "graphlens", "canvas"}
    SPEC_PAGE_SIZE = 50

    def __init__(self, repo: Optional[ComponentRegistryRepository] = None) -> None:
        self.repo = repo or ComponentRegistryRepository()

    def get_components(self, ctx: RequestContext) -> ComponentsPayload:
        raw_components = self.repo.list_components(ctx)
        components = [
            ComponentSpec.model_validate(record)
            for record in raw_components
        ]
        components.sort(key=lambda comp: comp.id)
        highest_version = max((comp.version for comp in components), default=0)
        return ComponentsPayload(version=highest_version, components=components)

    def get_atoms(self, ctx: RequestContext) -> AtomsPayload:
        raw_atoms = self.repo.list_atoms(ctx)
        atoms: List[AtomSpec] = []
        for record in raw_atoms:
            try:
                spec = AtomSpec.model_validate(record)
            except ValidationError as exc:
                error_response(
                    code="component_registry.invalid_atom_spec",
                    message="Invalid AtomSpec stored in registry",
                    status_code=400,
                    resource_kind="component_registry",
                    details={
                        "errors": exc.errors(),
                        "entry": record.get("id"),
                    },
                )
            atoms.append(spec)
        atoms.sort(key=lambda atom: atom.id)
        highest_version = max((atom.version for atom in atoms), default=0)
        return AtomsPayload(version=highest_version, atoms=atoms)

    def list_specs(
        self,
        ctx: RequestContext,
        kind: str,
        cursor: Optional[str] = None,
    ) -> RegistrySpecsPayload:
        normalized_kind = (kind or "").lower()
        if normalized_kind not in self.SPEC_KINDS:
            error_response(
                code="component_registry.invalid_spec_kind",
                message=f"Unsupported spec kind: {kind}",
                status_code=400,
                resource_kind="component_registry",
                details={"kind": kind},
            )

        offset = 0
        if cursor:
            try:
                offset = self._decode_cursor(cursor)
            except ValueError:
                cursor_invalid_error(
                    cursor,
                    domain="component_registry",
                    resource_kind="component_registry",
                )

        raw_specs = self.repo.list_specs(ctx)
        specs: List[RegistrySpec] = []
        for record in raw_specs:
            if str(record.get("kind", "")).lower() != normalized_kind:
                continue
            try:
                spec = RegistrySpec.model_validate(record)
            except ValidationError as exc:
                error_response(
                    code="component_registry.invalid_spec",
                    message="Invalid spec stored in registry",
                    status_code=400,
                    resource_kind="component_registry",
                    details={
                        "errors": exc.errors(),
                        "entry": record.get("id"),
                    },
                )
            specs.append(spec)

        specs.sort(key=lambda spec: spec.id)

        if offset > len(specs):
            cursor_invalid_error(
                cursor or "",
                domain="component_registry",
                resource_kind="component_registry",
            )

        page = specs[offset : offset + self.SPEC_PAGE_SIZE]
        next_cursor = None
        if offset + len(page) < len(specs):
            next_cursor = self._encode_cursor(offset + len(page))

        highest_version = max((spec.version for spec in specs), default=0)
        return RegistrySpecsPayload(
            specs=page,
            next_cursor=next_cursor,
            version=highest_version,
        )

    def get_spec(self, ctx: RequestContext, spec_id: str) -> Optional[RegistrySpec]:
        record = self.repo.get_spec(ctx, spec_id)
        if not record:
            return None
        try:
            return RegistrySpec.model_validate(record)
        except ValidationError as exc:
            error_response(
                code="component_registry.invalid_spec",
                message="Invalid spec stored in registry",
                status_code=400,
                resource_kind="component_registry",
                details={
                    "errors": exc.errors(),
                    "entry": spec_id,
                },
            )

    def save_component(self, ctx: RequestContext, component: Dict[str, Any]) -> None:
        """Helper for tests or admin tooling to persist components."""
        self.repo.save_component(ctx, component)

    def save_atom(self, ctx: RequestContext, atom: Dict[str, Any]) -> None:
        """Helper for tests or admin tooling to persist atoms."""
        self.repo.save_atom(ctx, atom)

    def save_spec(self, ctx: RequestContext, spec: Dict[str, Any]) -> None:
        """Helper for tests or admin tooling to persist specs."""
        self.repo.save_spec(ctx, spec)

    def register_surfaces(self, ctx: RequestContext, surfaces: List[Any]) -> None:
        """Register a list of ToolSurfaces (Atelier Standard)."""
        for s in surfaces:
            # Check if it's a model or dict, handle appropriately
            payload = s.model_dump() if hasattr(s, "model_dump") else s
            self.repo.save_surface(ctx, payload)

    def upsert_atoms(self, ctx: RequestContext, atoms: List[Any]) -> None:
        """Bulk upsert UI Atoms (Atelier Standard)."""
        for a in atoms:
            payload = a.model_dump() if hasattr(a, "model_dump") else a
            self.repo.save_atom(ctx, payload)

    def register_manifests(self, ctx: RequestContext, manifests: List[Any]) -> None:
        """Register generic Atelier Manifests."""
        for m in manifests:
            # Determine appropriate sub-store based on type
            # We assume 'm' is an AtelierManifest object (or dict)
            kind = getattr(m, "type", m.get("type") if isinstance(m, dict) else None)
            payload = m.model_dump() if hasattr(m, "model_dump") else m

            if kind == "atom":
                # Save to Atoms table
                self.repo.save_atom(ctx, payload)
            elif kind == "canvas":
                # Save to Specs table as generic spec (or specialized logic if we had it)
                # Map to Spec format:
                spec = {
                    "id": payload["id"],
                    "kind": "canvas",
                    "version": 1,
                    "schema": {},
                    "defaults": {},
                    "controls": {},
                    "token_surface": payload.get("acceptedTokens", []),
                    "metadata": payload
                }
                self.repo.save_spec(ctx, spec)
            elif kind == "surface":
                # Map to Surface table
                 self.repo.save_surface(ctx, payload)
            # Add handling for token_set etc.
            elif kind == "token_set":
                 spec = {
                    "id": payload["id"],
                    "kind": "token",
                    "version": 1,
                    "schema": {},
                    "defaults": {},
                    "controls": {},
                    "token_surface": [],
                    "metadata": payload
                }
                 self.repo.save_spec(ctx, spec)

    @staticmethod
    def _encode_cursor(offset: int) -> str:
        token = str(offset).encode("ascii")
        return base64.urlsafe_b64encode(token).decode("ascii").rstrip("=")

    @staticmethod
    def _decode_cursor(cursor: str) -> int:
        trimmed = cursor.strip()
        padded = trimmed + "=" * (-len(trimmed) % 4)
        try:
            decoded = base64.urlsafe_b64decode(padded).decode("ascii")
            offset = int(decoded)
        except (ValueError, binascii.Error):
            raise ValueError("Invalid cursor")
        if offset < 0:
            raise ValueError("Invalid cursor")
        return offset


class SystemRegistryService:
    """Service for managing schema-agnostic system registry entries."""

    def __init__(self, repo: Optional[SystemRegistryRepository] = None) -> None:
        self.repo = repo or SystemRegistryRepository()

    def get_namespaces(self, ctx: RequestContext) -> List[str]:
        """Return list of known namespaces."""
        # This list could be dynamic, but for now we list the expected ones
        return ["connectors", "firearms", "kpis", "utms", "canvases", "muscles", "agents"]

    def list_entries(self, ctx: RequestContext, namespace: str) -> List[RegistryEntry]:
        """List all entries for a namespace."""
        entries = self.repo.list_entries(ctx, namespace)

        # Lazy seeding for t_system if empty and known namespace
        if not entries and ctx.tenant_id == "t_system" and namespace in ["connectors", "firearms"]:
            self.seed_defaults(ctx)
            entries = self.repo.list_entries(ctx, namespace)

        results = []
        for record in entries:
            try:
                results.append(RegistryEntry.model_validate(record))
            except ValidationError:
                # Log or skip invalid entries
                pass
        return results

    def upsert_entry(self, ctx: RequestContext, namespace: str, payload: RegistryEntry) -> RegistryEntry:
        """Create or update a registry entry."""
        # Validation Logic (Task R4)
        if namespace == "connectors":
            if "auth_type" not in payload.config:
                 error_response(
                    code="registry.invalid_config",
                    message="Connectors must have 'auth_type' in config",
                    status_code=400,
                    resource_kind="component_registry",
                )
        if namespace == "kpi" or namespace == "kpis":
             if "unit" not in payload.config:
                 error_response(
                    code="registry.invalid_config",
                    message="KPIs must have 'unit' in config",
                    status_code=400,
                    resource_kind="component_registry",
                )

        # Ensure consistency
        payload.namespace = namespace
        # We don't overwrite tenant_id strictly if it's already set, but the repo saves what is given.
        # Ideally, we should enforce that the user cannot write to another tenant unless they are system.
        # But TabularStoreService handles tenant isolation usually.
        # However, for t_system, it might be different.
        # Let's trust the payload but verify context?
        # For this task, we assume the payload is correct or we overwrite it.
        # Let's overwrite tenant_id with context's tenant_id to be safe and consistent with TabularStore.
        payload.tenant_id = ctx.tenant_id

        self.repo.upsert_entry(ctx, payload.model_dump())
        return payload

    def delete_entry(self, ctx: RequestContext, namespace: str, key: str) -> None:
        self.repo.delete_entry(ctx, namespace, key)

    def seed_defaults(self, ctx: RequestContext) -> None:
        """Seed default data for t_system."""
        if ctx.tenant_id != "t_system":
            return

        # Seed Connectors
        connectors = [
            {"key": "shopify", "name": "Shopify", "config": {"scopes": ["read_products", "write_orders"], "auth_type": "oauth2"}},
            {"key": "youtube", "name": "YouTube", "config": {"scopes": ["upload", "analytics"], "auth_type": "oauth2"}},
            {"key": "google_ads", "name": "Google Ads", "config": {"auth_type": "oauth2"}},
            {"key": "meta_ads", "name": "Meta Ads", "config": {"auth_type": "oauth2"}},
            {"key": "klaviyo", "name": "Klaviyo", "config": {"auth_type": "api_key"}},
            {"key": "tiktok", "name": "TikTok", "config": {"auth_type": "oauth2"}},
            {"key": "slack", "name": "Slack", "config": {"auth_type": "oauth2"}},
        ]

        for c in connectors:
            entry = RegistryEntry(
                id=f"connectors::{c['key']}",
                namespace="connectors",
                key=c['key'],
                name=c['name'],
                config=c['config'],
                tenant_id="t_system"
            )
            self.repo.upsert_entry(ctx, entry.model_dump())

        # Seed Firearms
        firearms = [
            {"key": "commercial_license", "name": "Commercial License", "config": {"requires_approval": True, "max_budget": 1000}},
            {"key": "nuke_license", "name": "Nuke License", "config": {"requires_approval": True, "requires_admin": True}},
        ]

        for f in firearms:
            entry = RegistryEntry(
                id=f"firearms::{f['key']}",
                namespace="firearms",
                key=f['key'],
                name=f['name'],
                config=f['config'],
                tenant_id="t_system"
            )
            self.repo.upsert_entry(ctx, entry.model_dump())


_default_service: Optional[ComponentRegistryService] = None
_default_system_registry_service: Optional[SystemRegistryService] = None


def get_component_registry_service() -> ComponentRegistryService:
    global _default_service
    if _default_service is None:
        _default_service = ComponentRegistryService()
    return _default_service


def set_component_registry_service(service: ComponentRegistryService) -> None:
    global _default_service
    _default_service = service


def get_system_registry_service() -> SystemRegistryService:
    global _default_system_registry_service
    if _default_system_registry_service is None:
        _default_system_registry_service = SystemRegistryService()
    return _default_system_registry_service


def set_system_registry_service(service: SystemRegistryService) -> None:
    global _default_system_registry_service
    _default_system_registry_service = service
