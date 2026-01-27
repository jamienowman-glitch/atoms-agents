from typing import Dict, Any, List, Optional
from dataclasses import dataclass, field

@dataclass
class LensOverlayCard:
    """
    Defines a Lens Overlay.
    Lens Overlays provide UI-specific configurations, layouts, or metadata
    that "lens" onto the underlying graph without modifying the core logic.
    """
    overlay_id: str
    target_type: str # "flow", "node", "provider"
    target_id: str # ID of the entity being overlaid

    # UI Configuration
    ui_schema: Dict[str, Any] = field(default_factory=dict) # Form definitions
    ui_layout: Dict[str, Any] = field(default_factory=dict) # Visual positioning
    ui_theme: Optional[str] = None

    # Validation Rules (that are UI specific)
    validation_rules: List[str] = field(default_factory=list)

    card_type: str = "lens_overlay"

    # Minimal validation emulated
    def __post_init__(self):
        if not self.overlay_id.startswith("lens."):
            raise ValueError("Lens Overlay ID must start with 'lens.'")
