from dataclasses import dataclass, field
from typing import List, Optional


@dataclass
class TaskCard:
    task_id: str
    name: str
    goal: str
    constraints: List[str] = field(default_factory=list)
    acceptance_criteria: List[str] = field(default_factory=list)
    inputs_schema_ref: Optional[str] = None
    outputs_schema_ref: Optional[str] = None
    notes: str = ""
    card_type: str = "task"

