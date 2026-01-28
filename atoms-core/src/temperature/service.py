from __future__ import annotations

from datetime import datetime, timedelta, timezone
from typing import Dict, List, Optional

from src.identity.models import RequestContext
from src.realtime.contracts import ActorType, EventIds, EventMeta, EventPriority, PersistPolicy, RoutingKeys, StreamEvent
from src.realtime.timeline import get_timeline_service
from src.temperature.models import TemperatureCeilingConfig, TemperatureFloorConfig, TemperatureSnapshot, TemperatureWeights
from src.temperature.repository import InMemoryTemperatureRepository, SupabaseTemperatureRepository, TemperatureRepository


class TemperatureMetricsAdapter:
    source_id = "unknown"

    def fetch_metrics(
        self,
        ctx: RequestContext,
        space_id: str,
        surface_ids: Optional[List[str]],
        window_start: datetime,
        window_end: datetime,
        metric_keys: Optional[list[str]] = None,
    ) -> Dict[str, float]:
        raise NotImplementedError


class NullMetricsAdapter(TemperatureMetricsAdapter):
    source_id = "stub"

    def fetch_metrics(
        self,
        ctx: RequestContext,
        space_id: str,
        surface_ids: Optional[List[str]],
        window_start: datetime,
        window_end: datetime,
        metric_keys: Optional[list[str]] = None,
    ) -> Dict[str, float]:
        return {}


class TemperatureService:
    def __init__(
        self,
        repo: Optional[TemperatureRepository] = None,
        metrics_adapter: Optional[TemperatureMetricsAdapter] = None,
    ) -> None:
        self.repo = repo or SupabaseTemperatureRepository()
        self.metrics_adapter = metrics_adapter or NullMetricsAdapter()

    def _resolve_space(self, space_id: Optional[str], ctx: RequestContext) -> str:
        resolved = space_id or getattr(ctx, "space_id", None)
        if not resolved:
            raise ValueError("space_id is required")
        return resolved

    def upsert_floor(self, ctx: RequestContext, cfg: TemperatureFloorConfig) -> TemperatureFloorConfig:
        cfg.space_id = self._resolve_space(cfg.space_id, ctx)
        cfg.tenant_id = ctx.tenant_id
        cfg.env = ctx.env
        cfg.updated_at = datetime.now(timezone.utc)
        return self.repo.upsert_floor(cfg)

    def upsert_ceiling(self, ctx: RequestContext, cfg: TemperatureCeilingConfig) -> TemperatureCeilingConfig:
        cfg.space_id = self._resolve_space(cfg.space_id, ctx)
        cfg.tenant_id = ctx.tenant_id
        cfg.env = ctx.env
        cfg.updated_at = datetime.now(timezone.utc)
        return self.repo.upsert_ceiling(cfg)

    def upsert_weights(self, ctx: RequestContext, cfg: TemperatureWeights) -> TemperatureWeights:
        cfg.space_id = self._resolve_space(cfg.space_id, ctx)
        cfg.tenant_id = ctx.tenant_id
        cfg.env = ctx.env
        cfg.updated_at = datetime.now(timezone.utc)
        return self.repo.upsert_weights(cfg)

    def get_config_bundle(self, ctx: RequestContext, space_id: str) -> Dict[str, object]:
        space_value = self._resolve_space(space_id, ctx)
        return {
            "floors": self.repo.get_floor(ctx.tenant_id, ctx.env, space_value),
            "ceilings": self.repo.get_ceiling(ctx.tenant_id, ctx.env, space_value),
            "weights": self.repo.get_weights(ctx.tenant_id, ctx.env, space_value),
        }

    def list_snapshots(self, ctx: RequestContext, space_id: str, limit: int = 20, offset: int = 0) -> List[TemperatureSnapshot]:
        space_value = self._resolve_space(space_id, ctx)
        return self.repo.list_snapshots(ctx.tenant_id, ctx.env, space_value, limit=limit, offset=offset)

    def compute_temperature(
        self,
        ctx: RequestContext,
        space_id: str,
        surface_ids: Optional[List[str]] = None,
        window_days: int = 7,
        metrics: Optional[Dict[str, float]] = None,
    ) -> TemperatureSnapshot:
        space_value = self._resolve_space(space_id, ctx)
        floor_cfg = self.repo.get_floor(ctx.tenant_id, ctx.env, space_value)
        ceiling_cfg = self.repo.get_ceiling(ctx.tenant_id, ctx.env, space_value)
        weights_cfg = self.repo.get_weights(ctx.tenant_id, ctx.env, space_value) or TemperatureWeights(
            tenant_id=ctx.tenant_id, env=ctx.env, space_id=space_value, weights={}
        )

        window_end = datetime.now(timezone.utc)
        window_start = window_end - timedelta(days=window_days)

        metric_keys: List[str] = list(weights_cfg.weights.keys())
        if floor_cfg:
            metric_keys.extend(list(floor_cfg.performance_floors.keys()))
            metric_keys.extend(list(floor_cfg.cadence_floors.keys()))
        if ceiling_cfg:
            metric_keys.extend(list(ceiling_cfg.ceilings.keys()))

        raw_metrics = metrics or self.metrics_adapter.fetch_metrics(
            ctx,
            space_value,
            surface_ids,
            window_start,
            window_end,
            metric_keys=metric_keys,
        )

        floors_breached = self._breaches(raw_metrics, floor_cfg.performance_floors if floor_cfg else {})
        cadence_breaches = self._breaches(raw_metrics, floor_cfg.cadence_floors if floor_cfg else {})
        ceilings_breached = self._ceilings(raw_metrics, ceiling_cfg.ceilings if ceiling_cfg else {})

        score = self._aggregate(raw_metrics, weights_cfg.weights)
        snapshot = TemperatureSnapshot(
            tenant_id=ctx.tenant_id,
            env=ctx.env,
            space_id=space_value,
            surface_ids=surface_ids,
            value=score,
            window_start=window_start,
            window_end=window_end,
            floors_breached=floors_breached + cadence_breaches,
            ceilings_breached=ceilings_breached,
            raw_metrics=raw_metrics,
            source=getattr(self.metrics_adapter, "source_id", "unknown"),
            usage_window_days=window_days,
            kpi_corridors_used=[],
        )
        saved = self.repo.save_snapshot(snapshot)
        self._emit_snapshot_event(ctx, saved)
        return saved

    def _emit_snapshot_event(self, ctx: RequestContext, snap: TemperatureSnapshot) -> None:
        actor_type = ActorType.SYSTEM if ctx.user_id == "system" else ActorType.HUMAN
        routing = RoutingKeys(
            tenant_id=ctx.tenant_id,
            mode=ctx.mode,
            project_id=ctx.project_id,
            app_id=ctx.app_id,
            surface_id=ctx.surface_id,
            actor_id=ctx.user_id or "system",
            actor_type=actor_type,
        )
        event = StreamEvent(
            type="temperature.snapshot",
            routing=routing,
            data=snap.model_dump(),
            ids=EventIds(
                request_id=ctx.request_id,
                run_id=ctx.run_id,
                step_id="temperature_snapshot",
            ),
            meta=EventMeta(
                priority=EventPriority.INFO,
                persist=PersistPolicy.ALWAYS,
            ),
        )
        timeline = get_timeline_service()
        timeline.store.append("unified_timeline", event, ctx)

    @staticmethod
    def _breaches(actuals: Dict[str, float], mins: Dict[str, float]) -> List[str]:
        return [k for k, v in mins.items() if actuals.get(k, 0) < v]

    @staticmethod
    def _ceilings(actuals: Dict[str, float], maxes: Dict[str, float]) -> List[str]:
        return [k for k, v in maxes.items() if actuals.get(k, 0) > v]

    @staticmethod
    def _aggregate(actuals: Dict[str, float], weights: Dict[str, float]) -> float:
        if not weights:
            return 0.0
        total_weight = sum(abs(w) for w in weights.values()) or 1.0
        score = 0.0
        for key, weight in weights.items():
            score += actuals.get(key, 0.0) * weight
        return score / total_weight


_default_service: Optional[TemperatureService] = None


def get_temperature_service() -> TemperatureService:
    global _default_service
    if _default_service is None:
        _default_service = TemperatureService()
    return _default_service
