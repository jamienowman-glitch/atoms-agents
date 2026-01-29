"""
Construction Domain Models.
Ports of PlanOfWork, BoQModel, and CostModel from northstar-engines/atoms-muscle.
"""

from __future__ import annotations

import uuid
from datetime import datetime, timezone
from enum import Enum
from typing import Any, Dict, List, Literal, Optional

from pydantic import BaseModel, Field


# --- Plan of Work Models ---

class TaskCategory(str, Enum):
    """Task categories in building construction."""
    FOUNDATION = "foundation"
    STRUCTURE = "structure"
    ENVELOPE = "envelope"
    MEP = "mep"  # Mechanical, Electrical, Plumbing
    FINISHES = "finishes"
    DOORS_WINDOWS = "doors_windows"
    TESTING = "testing"
    HANDOVER = "handover"


class DependencyType(str, Enum):
    """Types of task dependencies."""
    FINISH_TO_START = "finish_to_start"  # Standard predecessor
    START_TO_START = "start_to_start"  # Can overlap


class PlanDependency(BaseModel):
    """Dependency relationship between tasks."""
    predecessor_task_id: str
    successor_task_id: str
    dependency_type: DependencyType = DependencyType.FINISH_TO_START
    lag_days: float = 0.0  # Delay between tasks


class PlanTask(BaseModel):
    """Single task in the plan of work."""
    id: str  # Deterministic hash-based ID

    # Task description
    name: str
    description: str
    category: TaskCategory

    # Scheduling
    duration_days: float
    dependencies: List[PlanDependency] = Field(default_factory=list)

    # Resources and cost
    resource_tags: List[str] = Field(default_factory=list)
    cost_refs: List[str] = Field(default_factory=list)  # Cost item IDs
    boq_refs: List[str] = Field(default_factory=list)  # BoQ item IDs

    # Derived during planning
    early_start_day: float = 0.0
    early_finish_day: float = 0.0
    late_start_day: Optional[float] = None
    late_finish_day: Optional[float] = None
    float_days: Optional[float] = None
    is_critical: bool = False

    # Metadata
    calc_version: str = "1.0.0"
    template_used: str = ""
    productivity_assumption: str = ""
    meta: Dict[str, Any] = Field(default_factory=dict)

    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class PlanOfWork(BaseModel):
    """Complete plan of work with task graph and scheduling."""
    id: str = Field(default_factory=lambda: uuid.uuid4().hex)

    # Source reference
    cost_model_id: str

    # Tasks and sequencing
    tasks: List[PlanTask] = Field(default_factory=list)
    all_dependencies: List[PlanDependency] = Field(default_factory=list)

    # Project summary
    critical_path_duration_days: float = 0.0
    critical_path_task_ids: List[str] = Field(default_factory=list)
    total_float_days: float = 0.0

    # Statistics
    task_count: int = 0
    task_count_by_category: Dict[str, int] = Field(default_factory=dict)

    # Metadata
    template_version: str = "1.0.0"
    productivity_config: Dict[str, float] = Field(default_factory=dict)
    calc_version: str = "1.0.0"
    model_hash: Optional[str] = None

    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    meta: Dict[str, Any] = Field(default_factory=dict)


class PlanRequest(BaseModel):
    """Request to generate plan from cost data."""
    cost_model_id: str
    template_version: Optional[str] = None
    productivity_config: Dict[str, float] = Field(default_factory=dict)
    tenant_id: Optional[str] = None
    env: Optional[str] = None


class PlanResponse(BaseModel):
    """Response from plan generation."""
    plan_artifact_id: str
    plan_model_id: str
    task_count: int
    task_count_by_category: Dict[str, int]
    critical_path_duration_days: float
    model_hash: str
    template_version: str
    created_at: datetime
    meta: Dict[str, Any] = Field(default_factory=dict)


# --- BoQ Models ---

class UnitType(str, Enum):
    """Quantity units."""
    # Length
    MM = "mm"
    CM = "cm"
    M = "m"
    FT = "ft"
    IN = "in"

    # Area
    MM2 = "mm²"
    CM2 = "cm²"
    M2 = "m²"
    FT2 = "ft²"

    # Volume
    MM3 = "mm³"
    CM3 = "cm³"
    M3 = "m³"
    FT3 = "ft³"

    # Count
    COUNT = "count"
    NO = "no"


class FormulaType(str, Enum):
    """Types of quantity formulas."""
    WALL_LENGTH = "wall_length"
    WALL_AREA = "wall_area"
    WALL_AREA_NET = "wall_area_net"  # With openings deducted
    SLAB_AREA = "slab_area"
    SLAB_VOLUME = "slab_volume"
    COLUMN_COUNT = "column_count"
    COLUMN_VOLUME = "column_volume"
    COLUMN_LENGTH = "column_length"
    DOOR_COUNT = "door_count"
    DOOR_AREA = "door_area"
    WINDOW_COUNT = "window_count"
    WINDOW_AREA = "window_area"
    ROOM_AREA = "room_area"
    ROOM_PERIMETER = "room_perimeter"
    OPENING_AREA = "opening_area"
    UNKNOWN = "unknown"


class Scope(BaseModel):
    """Scope/zone/level grouping."""
    scope_id: str = Field(default_factory=lambda: uuid.uuid4().hex[:8])
    scope_name: str  # "Ground Floor", "Zone A", etc.
    level_id: Optional[str] = None  # Reference to semantic level
    zone_tag: Optional[str] = None  # Custom zone/room tag

    # Totals per scope
    item_count: int = 0
    total_area: Optional[float] = None
    total_volume: Optional[float] = None
    total_length: Optional[float] = None
    total_count: int = 0


class BoQItem(BaseModel):
    """Single bill of quantities item."""
    id: str  # Deterministic hash-based ID

    # Classification
    element_type: Literal["wall", "door", "window", "slab", "column", "room", "stair", "opening", "unknown"]

    # Quantity data
    quantity: float
    unit: UnitType
    quantity_in_original_units: Optional[float] = None  # For reference
    original_unit: Optional[UnitType] = None

    # Location & scope
    level_id: Optional[str] = None
    scope_id: Optional[str] = None
    zone_tag: Optional[str] = None

    # Source & formula
    source_element_ids: List[str] = Field(default_factory=list)  # semantic element IDs
    source_cad_entity_ids: List[str] = Field(default_factory=list)  # CAD entity IDs
    formula_used: FormulaType
    calc_version: str = "1.0.0"

    # Details
    attributes: Dict[str, Any] = Field(default_factory=dict)
    meta: Dict[str, Any] = Field(default_factory=dict)

    # Metadata
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class BoQModel(BaseModel):
    """Complete bill of quantities."""
    id: str = Field(default_factory=lambda: uuid.uuid4().hex)

    # Source reference
    semantic_model_id: str

    # BoQ data
    items: List[BoQItem] = Field(default_factory=list)
    scopes: List[Scope] = Field(default_factory=list)

    # Statistics
    item_count: int = 0
    item_count_by_type: Dict[str, int] = Field(default_factory=dict)

    # Rules and versioning
    calc_version: str = "1.0.0"
    calc_params: Dict[str, Any] = Field(default_factory=dict)  # Thickness defaults, tolerances, etc.
    adapter_version: str = "1.0.0"

    # Determinism
    model_hash: Optional[str] = None

    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    meta: Dict[str, Any] = Field(default_factory=dict)


class BoQRequest(BaseModel):
    """Request to generate BoQ from semantic model."""
    semantic_model_id: str
    calc_version: Optional[str] = None
    calc_params: Dict[str, Any] = Field(default_factory=dict)
    tenant_id: Optional[str] = None
    env: Optional[str] = None


class BoQResponse(BaseModel):
    """Response from BoQ generation."""
    boq_artifact_id: str
    boq_model_id: str
    item_count: int
    item_count_by_type: Dict[str, int]
    scope_count: int
    model_hash: str
    calc_version: str
    created_at: datetime
    meta: Dict[str, Any] = Field(default_factory=dict)


# --- Cost Models ---

class Currency(str, Enum):
    """Supported currencies (TODO: USD as default per phase doc)."""
    USD = "USD"
    GBP = "GBP"
    EUR = "EUR"
    CAD = "CAD"
    AUD = "AUD"
    JPY = "JPY"


class CostAssumption(BaseModel):
    """Cost assumption/note."""
    key: str  # "markup", "tax", "discount", "contingency", etc.
    value: float  # Percentage or fixed amount
    applied: bool = True


class RateRecord(BaseModel):
    """Single rate in catalog."""
    element_type: str  # "wall", "door", "slab", etc.
    unit_type: str  # "m2", "count", "m3", etc.
    unit_rate: float  # Cost per unit
    currency: Currency = Currency.USD
    markup_pct: float = 0.0
    description: str = ""


class CostCatalog(BaseModel):
    """Rate catalog with versioning."""
    version: str = "1.0.0"
    currency: Currency = Currency.USD  # Default currency
    fx_rates: Dict[str, float] = Field(default_factory=dict)  # FX table: "GBP"->0.73, etc.
    rates: List[RateRecord] = Field(default_factory=list)
    markup_pct: float = 0.0  # Catalog-level markup
    tax_pct: float = 0.0  # Catalog-level tax
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    meta: Dict[str, Any] = Field(default_factory=dict)

    def get_rate(
        self,
        element_type: str,
        unit_type: str,
        fallback: float = 0.0,
    ) -> Optional[float]:
        """Get unit rate from catalog."""
        for record in self.rates:
            if record.element_type == element_type and record.unit_type == unit_type:
                return record.unit_rate
        return fallback if fallback is not None else None

    def convert_currency(self, amount: float, from_curr: Currency, to_curr: Currency) -> float:
        """Convert amount between currencies using FX table."""
        if from_curr == to_curr:
            return amount

        # Get FX rate
        fx_key = f"{from_curr.value}/{to_curr.value}"
        if fx_key not in self.fx_rates:
            # Try reverse
            fx_key = f"{to_curr.value}/{from_curr.value}"
            if fx_key in self.fx_rates:
                rate = 1.0 / self.fx_rates[fx_key]
            else:
                # Default to 1:1 if not found
                rate = 1.0
        else:
            rate = self.fx_rates[fx_key]

        return amount * rate


class CostItem(BaseModel):
    """Single cost item."""
    id: str  # Deterministic hash-based ID

    # Reference
    boq_item_id: str  # Source BoQ item
    boq_item_type: str  # wall, door, etc.
    boq_item_quantity: float  # From BoQ
    boq_item_unit: str  # From BoQ (m2, count, etc.)

    # Costing
    unit_rate: float  # Cost per unit
    currency: Currency = Currency.USD
    extended_cost: float  # quantity × unit_rate
    extended_cost_in_base_currency: Optional[float] = None

    # Assumptions
    assumptions: List[CostAssumption] = Field(default_factory=list)
    category: Optional[str] = None  # "structure", "interior", etc.

    # Metadata
    source_catalog_version: str = "1.0.0"
    calc_version: str = "1.0.0"
    meta: Dict[str, Any] = Field(default_factory=dict)

    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class CostRollup(BaseModel):
    """Cost summary for a scope."""
    scope_id: Optional[str] = None
    scope_name: str = "Total"

    item_count: int = 0
    total_cost: float = 0.0
    currency: Currency = Currency.USD

    by_type: Dict[str, float] = Field(default_factory=dict)  # Subtotals by element type
    meta: Dict[str, Any] = Field(default_factory=dict)


class CostModel(BaseModel):
    """Complete cost estimate."""
    id: str = Field(default_factory=lambda: uuid.uuid4().hex)

    # Source reference
    boq_model_id: str

    # Cost data
    items: List[CostItem] = Field(default_factory=list)
    rollups: List[CostRollup] = Field(default_factory=list)

    # Summary
    total_cost: float = 0.0
    total_cost_by_currency: Dict[str, float] = Field(default_factory=dict)

    # Configuration
    currency: Currency = Currency.USD
    catalog_version: str = "1.0.0"
    markup_pct: float = 0.0
    tax_pct: float = 0.0

    # Determinism
    model_hash: Optional[str] = None

    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    meta: Dict[str, Any] = Field(default_factory=dict)


class CostRequest(BaseModel):
    """Request to generate costs from BoQ."""
    boq_model_id: str
    catalog_version: str = "1.0.0"
    currency: Currency = Currency.USD
    markup_pct: float = 0.0
    tax_pct: float = 0.0
    catalog_overrides: Optional[Dict[str, float]] = None


class CostResponse(BaseModel):
    """Response from cost generation."""
    cost_artifact_id: str
    cost_model_id: str
    total_cost: float
    currency: Currency
    item_count: int
    rollup_count: int
    catalog_version: str
    model_hash: str
    created_at: datetime
    meta: Dict[str, Any] = Field(default_factory=dict)
