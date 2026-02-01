from dataclasses import dataclass, field
from typing import List, Optional

@dataclass
class ModeRunResult:
    status: str  # "PASS", "FAIL", "SKIP"
    reason: str
    artifacts_written: List[str] = field(default_factory=list)
    error: Optional[str] = None
    output: Optional[str] = None
