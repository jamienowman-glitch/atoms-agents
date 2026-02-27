from dataclasses import dataclass, field
from typing import List


@dataclass
class TokenMapCard:
    """
    CanvasLens / TokenLens: Token Scope & Targeting.
    Defines which shared state tokens (variables) a node can Read or Write.
    """
    token_map_id: str
    target_node_id: str
    read_tokens: List[str] = field(default_factory=list)
    write_tokens: List[str] = field(default_factory=list)
    notes: str = ""
    card_type: str = "lens_token_map"

