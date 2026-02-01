
from dataclasses import dataclass, field
from typing import Dict, Any, List, Optional

@dataclass
class NodeRunResult:
    node_id: str
    status: str  # PASS, FAIL, SKIP
    reason: str
    started_ts: float
    ended_ts: float
    artifacts_written: List[str] = field(default_factory=list)
    blackboard_writes: Dict[str, Any] = field(default_factory=dict)
    events: List[Dict[str, Any]] = field(default_factory=list)
    error: Optional[str] = None
