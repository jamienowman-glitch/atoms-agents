from __future__ import annotations

from typing import Any, Dict, List, Optional

from engines.common.error_envelope import missing_route_error
from engines.common.identity import RequestContext
from engines.storage.routing_service import TabularStoreService


class ComponentRegistryRepository:
    """Routing-aware persistence for component/atom/lens registry snapshots."""

    COMPONENTS_TABLE = "component_registry_components"
    ATOMS_TABLE = "component_registry_atoms"
    SPECS_TABLE = "component_registry_specs"
    SURFACES_TABLE = "component_registry_surfaces"

    def _tabular(self, ctx: RequestContext) -> TabularStoreService:
        try:
            return TabularStoreService(ctx, resource_kind="component_registry")
        except RuntimeError as exc:
            raise missing_route_error(
                resource_kind="component_registry",
                tenant_id=ctx.tenant_id,
                env=ctx.env,
            ) from exc

    def list_components(self, ctx: RequestContext) -> List[Dict[str, Any]]:
        """Return all component records for the current context."""
        return self._tabular(ctx).list_by_prefix(self.COMPONENTS_TABLE, "")

    def list_atoms(self, ctx: RequestContext) -> List[Dict[str, Any]]:
        """Return all atom records for the current context."""
        return self._tabular(ctx).list_by_prefix(self.ATOMS_TABLE, "")

    def list_specs(self, ctx: RequestContext) -> List[Dict[str, Any]]:
        """Return all registered specs for the current context."""
        return self._tabular(ctx).list_by_prefix(self.SPECS_TABLE, "")

    def get_spec(self, ctx: RequestContext, spec_id: str) -> Optional[Dict[str, Any]]:
        """Retrieve a single spec by ID."""
        return self._tabular(ctx).get(self.SPECS_TABLE, spec_id)

    def save_component(self, ctx: RequestContext, component: Dict[str, Any]) -> None:
        """Persist a component record (tests/admin helpers only)."""
        component_id = component.get("id")
        if not component_id:
            raise ValueError("component data must include id")
        self._tabular(ctx).upsert(self.COMPONENTS_TABLE, component_id, component)

    def save_atom(self, ctx: RequestContext, atom: Dict[str, Any]) -> None:
        """Persist an atom record (tests/admin helpers only)."""
        atom_id = atom.get("id")
        if not atom_id:
            raise ValueError("atom data must include id")
        self._tabular(ctx).upsert(self.ATOMS_TABLE, atom_id, atom)

    def save_spec(self, ctx: RequestContext, spec: Dict[str, Any]) -> None:
        """Persist a spec record (tests/admin helpers only)."""
        spec_id = spec.get("id")
        if not spec_id:
            raise ValueError("spec data must include id")
        self._tabular(ctx).upsert(self.SPECS_TABLE, spec_id, spec)

    def save_surface(self, ctx: RequestContext, surface: Dict[str, Any]) -> None:
        """Persist a surface record."""
        surface_id = surface.get("id")
        if not surface_id:
            raise ValueError("surface data must include id")
        self._tabular(ctx).upsert(self.SURFACES_TABLE, surface_id, surface)


class SystemRegistryRepository:
    """Persistence for schema-agnostic system registry entries."""

    SYSTEM_REGISTRY_TABLE = "system_registry_entries"

    def _tabular(self, ctx: RequestContext) -> TabularStoreService:
        try:
            return TabularStoreService(ctx, resource_kind="component_registry")
        except RuntimeError as exc:
            raise missing_route_error(
                resource_kind="component_registry",
                tenant_id=ctx.tenant_id,
                env=ctx.env,
            ) from exc

    def list_entries(self, ctx: RequestContext, namespace: str) -> List[Dict[str, Any]]:
        """List all entries for a given namespace (Tabular + External YAML)."""
        # 1. Database Entries
        prefix = f"{namespace}::"
        db_entries = []
        try:
            db_entries = self._tabular(ctx).list_by_prefix(self.SYSTEM_REGISTRY_TABLE, prefix)
        except Exception:
            # If DB is down or unconfigured, we proceed to External (Failover)
            pass
        
        # 2. External Registry Entries (The Bridge)
        from engines.config.runtime_config import get_external_registry_path
        ext_path = get_external_registry_path()
        
        if ext_path:
            import os
            import yaml
            import glob
            
            # Map "muscles" -> "muscle" directory per our harvest script
            dir_name = namespace
            if namespace == "muscles": dir_name = "muscle"
            
            target_dir = os.path.join(ext_path, dir_name)
            if os.path.exists(target_dir):
                yaml_files = glob.glob(os.path.join(target_dir, "*.yaml"))
                for yf in yaml_files:
                    try:
                        with open(yf, 'r') as f:
                            data = yaml.safe_load(f)
                            # Ensure system fields
                            if not data.get('tenant_id'):
                                data['tenant_id'] = ctx.tenant_id # Default to current context or system?
                            
                            # ID Collision: External wins or DB wins? 
                            # Let's say External is "Release" and DB is "Overrides". 
                            # But since we want to see the new stuff, we append.
                            # Usually we'd map by ID.
                            db_entries.append(data)
                    except Exception:
                        pass
                        
        return db_entries

    def get_entry(self, ctx: RequestContext, namespace: str, key: str) -> Optional[Dict[str, Any]]:
        """Retrieve a single entry."""
        storage_key = f"{namespace}::{key}"
        return self._tabular(ctx).get(self.SYSTEM_REGISTRY_TABLE, storage_key)

    def upsert_entry(self, ctx: RequestContext, entry: Dict[str, Any]) -> None:
        """Upsert a registry entry."""
        namespace = entry.get("namespace")
        key = entry.get("key")
        if not namespace or not key:
            raise ValueError("Entry must have namespace and key")

        storage_key = f"{namespace}::{key}"
        self._tabular(ctx).upsert(self.SYSTEM_REGISTRY_TABLE, storage_key, entry)

    def delete_entry(self, ctx: RequestContext, namespace: str, key: str) -> None:
        """Delete a registry entry."""
        storage_key = f"{namespace}::{key}"
        self._tabular(ctx).delete(self.SYSTEM_REGISTRY_TABLE, storage_key)
