from __future__ import annotations

from datetime import datetime
from typing import Dict, List, Optional, Protocol

from src.identity.middleware import supabase
from src.temperature.models import TemperatureCeilingConfig, TemperatureFloorConfig, TemperatureSnapshot, TemperatureWeights


class TemperatureRepository(Protocol):
    def upsert_floor(self, cfg: TemperatureFloorConfig) -> TemperatureFloorConfig: ...
    def upsert_ceiling(self, cfg: TemperatureCeilingConfig) -> TemperatureCeilingConfig: ...
    def upsert_weights(self, cfg: TemperatureWeights) -> TemperatureWeights: ...

    def get_floor(self, tenant_id: str, env: str, space_id: str) -> Optional[TemperatureFloorConfig]: ...
    def get_ceiling(self, tenant_id: str, env: str, space_id: str) -> Optional[TemperatureCeilingConfig]: ...
    def get_weights(self, tenant_id: str, env: str, space_id: str) -> Optional[TemperatureWeights]: ...

    def save_snapshot(self, snap: TemperatureSnapshot) -> TemperatureSnapshot: ...
    def list_snapshots(self, tenant_id: str, env: str, space_id: str, limit: int = 20, offset: int = 0) -> List[TemperatureSnapshot]: ...


def _serialize(value):
    if isinstance(value, datetime):
        return value.isoformat()
    if isinstance(value, list):
        return [_serialize(v) for v in value]
    if isinstance(value, dict):
        return {k: _serialize(v) for k, v in value.items()}
    return value


class SupabaseTemperatureRepository:
    def _table(self, name: str):
        if not supabase:
            raise RuntimeError("Supabase client not initialized")
        return supabase.table(name)

    def upsert_floor(self, cfg: TemperatureFloorConfig) -> TemperatureFloorConfig:
        data = _serialize(cfg.model_dump())
        response = self._table("temperature_floors").upsert(
            data, on_conflict="tenant_id,env,space_id"
        ).execute()
        if not response.data:
            return cfg
        return TemperatureFloorConfig(**response.data[0])

    def upsert_ceiling(self, cfg: TemperatureCeilingConfig) -> TemperatureCeilingConfig:
        data = _serialize(cfg.model_dump())
        response = self._table("temperature_ceilings").upsert(
            data, on_conflict="tenant_id,env,space_id"
        ).execute()
        if not response.data:
            return cfg
        return TemperatureCeilingConfig(**response.data[0])

    def upsert_weights(self, cfg: TemperatureWeights) -> TemperatureWeights:
        data = _serialize(cfg.model_dump())
        response = self._table("temperature_weights").upsert(
            data, on_conflict="tenant_id,env,space_id"
        ).execute()
        if not response.data:
            return cfg
        return TemperatureWeights(**response.data[0])

    def get_floor(self, tenant_id: str, env: str, space_id: str) -> Optional[TemperatureFloorConfig]:
        response = (
            self._table("temperature_floors")
            .select("*")
            .eq("tenant_id", tenant_id)
            .eq("env", env)
            .eq("space_id", space_id)
            .limit(1)
            .execute()
        )
        if not response.data:
            return None
        return TemperatureFloorConfig(**response.data[0])

    def get_ceiling(self, tenant_id: str, env: str, space_id: str) -> Optional[TemperatureCeilingConfig]:
        response = (
            self._table("temperature_ceilings")
            .select("*")
            .eq("tenant_id", tenant_id)
            .eq("env", env)
            .eq("space_id", space_id)
            .limit(1)
            .execute()
        )
        if not response.data:
            return None
        return TemperatureCeilingConfig(**response.data[0])

    def get_weights(self, tenant_id: str, env: str, space_id: str) -> Optional[TemperatureWeights]:
        response = (
            self._table("temperature_weights")
            .select("*")
            .eq("tenant_id", tenant_id)
            .eq("env", env)
            .eq("space_id", space_id)
            .limit(1)
            .execute()
        )
        if not response.data:
            return None
        return TemperatureWeights(**response.data[0])

    def save_snapshot(self, snap: TemperatureSnapshot) -> TemperatureSnapshot:
        data = _serialize(snap.model_dump())
        response = self._table("temperature_snapshots").insert(data).execute()
        if not response.data:
            return snap
        return TemperatureSnapshot(**response.data[0])

    def list_snapshots(self, tenant_id: str, env: str, space_id: str, limit: int = 20, offset: int = 0) -> List[TemperatureSnapshot]:
        response = (
            self._table("temperature_snapshots")
            .select("*")
            .eq("tenant_id", tenant_id)
            .eq("env", env)
            .eq("space_id", space_id)
            .order("created_at", desc=True)
            .range(offset, offset + limit - 1)
            .execute()
        )
        return [TemperatureSnapshot(**item) for item in response.data]


class InMemoryTemperatureRepository:
    def __init__(self) -> None:
        self._floors: Dict[tuple[str, str, str], TemperatureFloorConfig] = {}
        self._ceilings: Dict[tuple[str, str, str], TemperatureCeilingConfig] = {}
        self._weights: Dict[tuple[str, str, str], TemperatureWeights] = {}
        self._snapshots: Dict[tuple[str, str, str], List[TemperatureSnapshot]] = {}

    def _key(self, tenant_id: str, env: str, space_id: str) -> tuple[str, str, str]:
        return (tenant_id, env, space_id)

    def upsert_floor(self, cfg: TemperatureFloorConfig) -> TemperatureFloorConfig:
        self._floors[self._key(cfg.tenant_id or "", cfg.env or "", cfg.space_id or "")] = cfg
        return cfg

    def upsert_ceiling(self, cfg: TemperatureCeilingConfig) -> TemperatureCeilingConfig:
        self._ceilings[self._key(cfg.tenant_id or "", cfg.env or "", cfg.space_id or "")] = cfg
        return cfg

    def upsert_weights(self, cfg: TemperatureWeights) -> TemperatureWeights:
        self._weights[self._key(cfg.tenant_id or "", cfg.env or "", cfg.space_id or "")] = cfg
        return cfg

    def get_floor(self, tenant_id: str, env: str, space_id: str) -> Optional[TemperatureFloorConfig]:
        return self._floors.get(self._key(tenant_id, env, space_id))

    def get_ceiling(self, tenant_id: str, env: str, space_id: str) -> Optional[TemperatureCeilingConfig]:
        return self._ceilings.get(self._key(tenant_id, env, space_id))

    def get_weights(self, tenant_id: str, env: str, space_id: str) -> Optional[TemperatureWeights]:
        return self._weights.get(self._key(tenant_id, env, space_id))

    def save_snapshot(self, snap: TemperatureSnapshot) -> TemperatureSnapshot:
        key = self._key(snap.tenant_id, snap.env, snap.space_id)
        self._snapshots.setdefault(key, []).insert(0, snap)
        return snap

    def list_snapshots(self, tenant_id: str, env: str, space_id: str, limit: int = 20, offset: int = 0) -> List[TemperatureSnapshot]:
        key = self._key(tenant_id, env, space_id)
        items = self._snapshots.get(key, [])
        return items[offset : offset + limit]
