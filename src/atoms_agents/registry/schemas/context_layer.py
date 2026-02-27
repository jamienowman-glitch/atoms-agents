from dataclasses import dataclass, field
from typing import List, Optional


@dataclass
class ContextLayerCard:
    """
    ContextLens: Deep Context Enabler.
    Projects style, brand voice, specialised manifests, and knowledge pointers onto a Node.
    """
    context_id: str
    name: str

    style_guide_ref: Optional[str] = None
    voice_tone: Optional[str] = None
    manifest_refs: List[str] = field(default_factory=list)
    data_sources: List[str] = field(default_factory=list)

    notes: str = ""
    card_type: str = "lens_context"

