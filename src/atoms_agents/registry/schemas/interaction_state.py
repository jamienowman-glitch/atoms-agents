from dataclasses import dataclass, field
from typing import List


@dataclass
class InteractionStateCard:
    """
    ChatModeLens: Interaction State.
    Defines the 'Mode' of the chat rail (e.g. State of World, Debate, Research).
    """
    state_id: str
    mode_name: str
    system_instruction: str = ""
    allowed_actions: List[str] = field(default_factory=list)
    card_type: str = "lens_interaction"

