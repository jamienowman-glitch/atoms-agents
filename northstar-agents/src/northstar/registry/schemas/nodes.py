from dataclasses import dataclass, field
from typing import List, Optional, Dict

@dataclass
class NodeCard:
    node_id: str
    name: str
    kind: str  # agent | framework_team | subflow
    persona_ref: Optional[str] = None
    task_ref: Optional[str] = None
    artifact_outputs: List[str] = field(default_factory=list)
    blackboard_writes: List[str] = field(default_factory=list)
    blackboard_reads: List[str] = field(default_factory=list)
    model_ref: Optional[str] = None
    provider_ref: Optional[str] = None
    capability_ids: List[str] = field(default_factory=list)
    tool_refs: List[str] = field(default_factory=list)
    framework_mode_ref: Optional[str] = None
    subflow_ref: Optional[str] = None
    timeouts: Dict[str, int] = field(default_factory=dict)
    notes: str = ""
    card_type: str = "node"
