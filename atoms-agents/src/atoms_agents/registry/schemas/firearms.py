from dataclasses import dataclass, field
from typing import List, Dict, Any, Optional

@dataclass
class FirearmsLicenseCard:
    license_id: str
    name: str
    description: str
    allows_tools: bool = False
    allowed_tool_families: List[str] = field(default_factory=list)
    allows_code_execution: bool = False
    allows_web_grounding: bool = False
    allows_vision: bool = False
    allows_audio: bool = False
    allows_write_access: bool = False
