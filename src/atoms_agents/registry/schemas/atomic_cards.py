from dataclasses import dataclass, field
from typing import List, Optional, Dict

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

@dataclass
class ArtifactSpecCard:
    artifact_spec_id: str
    name: str
    artifact_kind: str
    mime_type: Optional[str] = None
    required_fields: List[str] = field(default_factory=list)
    max_bytes: Optional[int] = None
    viewer_hints: Dict[str, str] = field(default_factory=dict)
    notes: str = ""
    card_type: str = "artifact_spec"
