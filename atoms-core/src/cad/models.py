"""
CAD Domain Models.
Ports of CadModel, SemanticModel, and related structures from atoms-muscle.
"""

from __future__ import annotations

import uuid
from datetime import datetime, timezone
from enum import Enum
from typing import Any, Dict, List, Literal, Optional

from pydantic import BaseModel, Field, field_validator


# --- Cad Ingest Models ---

class UnitKind(str, Enum):
    """Supported unit systems."""
    MILLIMETER = "mm"
    CENTIMETER = "cm"
    METER = "m"
    FOOT = "ft"
    INCH = "in"


class EntityType(str, Enum):
    """Primitive entity types in CAD models."""
    LINE = "line"
    ARC = "arc"
    CIRCLE = "circle"
    POLYLINE = "polyline"
    POLYGON = "polygon"
    SOLID = "solid"
    SURFACE = "surface"
    BLOCK_INSTANCE = "block_instance"


class HealingActionKind(str, Enum):
    """Types of topology healing operations performed."""
    GAP_CLOSE = "gap_close"
    VERTEX_DEDUP = "vertex_dedup"
    WINDING_NORMALIZE = "winding_normalize"
    SNAP_TO_GRID = "snap_to_grid"
    DUPLICATE_REMOVE = "duplicate_remove"


class Vector3(BaseModel):
    """3D vector."""
    x: float
    y: float
    z: float = 0.0


class BoundingBox(BaseModel):
    """Axis-aligned bounding box."""
    min: Vector3
    max: Vector3


class HealingAction(BaseModel):
    """Record of a topology healing operation."""
    kind: HealingActionKind
    affected_entities: List[str] = Field(default_factory=list)
    description: str
    severity: Literal["info", "warning", "error"] = "info"


class Layer(BaseModel):
    """CAD layer/level info."""
    name: str
    visible: bool = True
    frozen: bool = False
    locked: bool = False
    color: Optional[str] = None  # e.g. "#FF0000"
    meta: Dict[str, Any] = Field(default_factory=dict)


class Entity(BaseModel):
    """Base entity in CAD model."""
    id: str  # Deterministic hash-based ID
    type: EntityType
    layer: str
    source_id: Optional[str] = None  # Original ID from source file
    geometry: Dict[str, Any]  # Type-specific geometry payload
    bbox: BoundingBox
    meta: Dict[str, Any] = Field(default_factory=dict)


class TopologyEdge(BaseModel):
    """Edge in topology graph connecting two entities."""
    from_entity_id: str
    to_entity_id: str
    edge_type: str  # "adjacent", "connected", "contained"
    distance: float = 0.0


class TopologyGraph(BaseModel):
    """Spatial and logical connectivity graph of entities."""
    entities: Dict[str, str] = Field(default_factory=dict)  # entity_id -> entity.type
    edges: List[TopologyEdge] = Field(default_factory=list)
    isolated_entities: List[str] = Field(default_factory=list)


class CadModel(BaseModel):
    """Normalized CAD model representation."""
    id: str = Field(default_factory=lambda: uuid.uuid4().hex)
    units: UnitKind
    origin: Vector3 = Field(default_factory=lambda: Vector3(x=0, y=0, z=0))
    bbox: BoundingBox
    
    # Core data
    layers: List[Layer] = Field(default_factory=list)
    entities: List[Entity] = Field(default_factory=list)
    topology: TopologyGraph = Field(default_factory=TopologyGraph)
    
    # Healing & provenance
    healing_actions: List[HealingAction] = Field(default_factory=list)
    
    # Metadata
    source_format: Literal["dxf", "ifc-lite", "unknown"] = "unknown"
    source_sha256: Optional[str] = None
    adapter_version: str = "1.0.0"
    tolerance: float = 0.001  # Default tolerance for healing
    model_hash: Optional[str] = None  # Hash of normalized model for caching
    
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    meta: Dict[str, Any] = Field(default_factory=dict)

    @field_validator("tolerance")
    @classmethod
    def tolerance_positive(cls, v: float) -> float:
        if v <= 0:
            raise ValueError("tolerance must be positive")
        return v


class CadIngestRequest(BaseModel):
    """Request to ingest a CAD file."""
    file_uri: Optional[str] = None  # For uploaded files, set after storage
    source_uri: Optional[str] = None  # Original source URL
    format_hint: Optional[Literal["dxf", "ifc-lite"]] = None
    unit_hint: Optional[UnitKind] = None
    tolerance: float = 0.001
    snap_to_grid: bool = False
    grid_size: float = 0.001
    max_file_size_mb: float = 100.0
    max_timeout_s: float = 30.0
    tenant_id: str
    env: str
    user_id: Optional[str] = None
    meta: Dict[str, Any] = Field(default_factory=dict)


class CadIngestResponse(BaseModel):
    """Response from CAD ingest operation."""
    cad_model_artifact_id: str
    model_id: str
    units: UnitKind
    entity_count: int
    layer_count: int
    healing_actions_count: int
    bbox: BoundingBox
    model_hash: str
    source_sha256: Optional[str]
    created_at: datetime
    meta: Dict[str, Any] = Field(default_factory=dict)


# --- Cad Semantics Models ---

class SemanticType(str, Enum):
    """Semantic element types in buildings."""
    WALL = "wall"
    DOOR = "door"
    WINDOW = "window"
    SLAB = "slab"
    COLUMN = "column"
    ROOM = "room"
    LEVEL = "level"
    STAIR = "stair"
    UNKNOWN = "unknown"


class EdgeType(str, Enum):
    """Types of spatial relationships."""
    ADJACENT = "adjacent"  # Touching/sharing edge
    CONTAINED = "contained"  # Inside/contained by
    CONNECTS = "connects"  # Door connects rooms
    CIRCULATION = "circulation"  # Stair connects levels


class Level(BaseModel):
    """Building level/story."""
    id: str = Field(default_factory=lambda: uuid.uuid4().hex[:8])
    name: str  # "Ground Floor", "Level 1", etc.
    elevation: float  # Absolute height
    floor_to_floor_height: Optional[float] = None  # Story height
    index: int = 0  # 0 = ground, 1 = first, etc.


class SemanticElement(BaseModel):
    """Classified CAD element with semantic type and metadata."""
    id: str  # Deterministic hash-based ID
    cad_entity_id: str  # Reference to original CadModel entity
    semantic_type: SemanticType
    layer: str

    # Geometry and location
    geometry_ref: Dict[str, Any]  # Pointer to entity geometry
    level_id: Optional[str] = None  # Which level it belongs to
    elevation: Optional[float] = None  # Z-coordinate or story elevation

    # Attributes
    attributes: Dict[str, Any] = Field(default_factory=dict)

    # Rule application
    rule_version: str = "1.0.0"
    confidence: float = 1.0  # 0-1 score
    rule_hits: List[str] = Field(default_factory=list)  # Which rules matched

    # Metadata
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class SpatialGraphNode(BaseModel):
    """Node in spatial graph (semantic element)."""
    node_id: str
    semantic_element_id: str
    semantic_type: SemanticType


class SpatialGraphEdge(BaseModel):
    """Edge in spatial graph (relationship between elements)."""
    from_node_id: str
    to_node_id: str
    edge_type: EdgeType
    confidence: float = 1.0
    meta: Dict[str, Any] = Field(default_factory=dict)


class SpatialGraph(BaseModel):
    """Complete spatial topology of semantic elements."""
    nodes: List[SpatialGraphNode] = Field(default_factory=list)
    edges: List[SpatialGraphEdge] = Field(default_factory=list)

    # Metadata
    adjacency_edge_count: int = 0
    containment_edge_count: int = 0
    connectivity_edge_count: int = 0
    graph_hash: Optional[str] = None


class SemanticModel(BaseModel):
    """Complete semantic model derived from CadModel."""
    id: str = Field(default_factory=lambda: uuid.uuid4().hex)

    # Source reference
    cad_model_id: str  # Parent CadModel ID

    # Semantic data
    elements: List[SemanticElement] = Field(default_factory=list)
    levels: List[Level] = Field(default_factory=list)
    spatial_graph: SpatialGraph = Field(default_factory=SpatialGraph)

    # Validation info
    warnings: List[str] = Field(default_factory=list)

    # Statistics
    element_count_by_type: Dict[str, int] = Field(default_factory=dict)
    level_count: int = 0

    # Rules and versioning
    rule_version: str = "1.0.0"
    rule_overrides: Dict[str, Any] = Field(default_factory=dict)
    adapter_version: str = "1.0.0"

    # Determinism
    model_hash: Optional[str] = None

    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    meta: Dict[str, Any] = Field(default_factory=dict)


class SemanticRequest(BaseModel):
    """Request to classify and build semantics for a CAD model."""
    cad_model_id: str
    rule_version: Optional[str] = None
    rule_overrides: Dict[str, Any] = Field(default_factory=dict)
    tenant_id: str
    env: str
    user_id: Optional[str] = None


class SemanticResponse(BaseModel):
    """Response from semantic classification."""
    semantic_artifact_id: str
    semantic_model_id: str
    element_count: int
    level_count: int
    wall_count: int
    door_count: int
    window_count: int
    slab_count: int
    column_count: int
    room_count: int = 0
    stair_count: int = 0
    unknown_count: int
    graph_edge_count: int
    spatial_graph_edge_count: Optional[int] = None
    rule_version: str
    created_at: datetime
    meta: Dict[str, Any] = Field(default_factory=dict)
