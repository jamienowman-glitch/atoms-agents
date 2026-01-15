from typing import List, Dict, Optional, Any
from pydantic import BaseModel, Field

# This file defines the V1 contract for the UI.
# It is the "ViewModel" for the builder.

class NodeData(BaseModel):
    id: str
    name: str
    kind: str # agent, subflow, etc.
    # Registry References (optional/missing until set)
    persona_ref: Optional[str] = None
    task_ref: Optional[str] = None
    provider_ref: Optional[str] = None
    model_ref: Optional[str] = None
    capabilities: List[str] = Field(default_factory=list)
    # Visual Layout
    layout_x: float = 0.0
    layout_y: float = 0.0
    # Additional
    notes: Optional[str] = None

class EdgeData(BaseModel):
    id: str # Unique ID used by UI framework (often generated)
    source: str
    target: str
    label: Optional[str] = None

class FlowData(BaseModel):
    id: str
    name: str
    objective: str
    entry_node: str
    exit_nodes: List[str] = Field(default_factory=list)

class ValidationItem(BaseModel):
    """Validation result for a single entity (node or flow)."""
    id: str
    valid: bool
    errors: List[str] = Field(default_factory=list)
    warnings: List[str] = Field(default_factory=list)
    missing_refs: List[str] = Field(default_factory=list) # e.g. ["persona_ref"]
    policy_violations: List[str] = Field(default_factory=list) # Human readable violations

class ValidationReportV1(BaseModel):
    """Overall validation report."""
    valid: bool
    tenant_id: Optional[str] = None
    applied_policies: List[str] = Field(default_factory=list) # List of policy pack IDs
    items: Dict[str, ValidationItem] = Field(default_factory=dict)
    live_results: Dict[str, Any] = Field(default_factory=dict) # E.g. latency, status

class RegistryOption(BaseModel):
    """Single option for a dropdown."""
    id: str
    label: str
    meta: Dict[str, Any] = Field(default_factory=dict)

class RegistryRefs(BaseModel):
    """Available registry data for UI dropdowns."""
    personas: List[RegistryOption] = Field(default_factory=list)
    tasks: List[RegistryOption] = Field(default_factory=list)
    providers: List[RegistryOption] = Field(default_factory=list)
    models: List[RegistryOption] = Field(default_factory=list)
    capabilities: List[RegistryOption] = Field(default_factory=list)

class GraphPayloadV1(BaseModel):
    """
    The canonical payload for the Builder UI.
    Contains everything needed to render the editor state.
    """
    flow: FlowData
    nodes: List[NodeData]
    edges: List[EdgeData]
    registry: RegistryRefs
    validation: ValidationReportV1
