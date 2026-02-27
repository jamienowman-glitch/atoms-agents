from dataclasses import dataclass, field
from typing import List, Optional


@dataclass
class PersonaCard:
    persona_id: str
    name: str
    description: str
    style_tags: List[str] = field(default_factory=list)
    principles: List[str] = field(default_factory=list)
    system_guidance_ref: Optional[str] = None
    version: Optional[str] = None
    icon_light: Optional[str] = None
    icon_dark: Optional[str] = None
    notes: str = ""
    card_type: str = "persona"

