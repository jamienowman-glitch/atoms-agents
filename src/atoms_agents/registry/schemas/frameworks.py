from dataclasses import dataclass, field
from typing import List

@dataclass
class FrameworkCard:
    framework_id: str
    name: str
    description: str = ""
    supported_modes: List[str] = field(default_factory=list)
    card_type: str = "framework"
