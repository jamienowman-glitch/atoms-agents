from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional


@dataclass
class ModeCard:
    id: str  # e.g. "autogen-basic"
    framework: str  # e.g. "autogen"
    official_name: str  # e.g. "AutoGen Basic Chat"
    invoke_primitive: str  # e.g. "single_turn", "chat_loop"
    entrypoint: str  # e.g. "atoms_agents.runtime.modes.autogen.basic.run"

    params: Dict[str, Any] = field(default_factory=dict)
    streaming_support: bool = False
    docs_urls: List[str] = field(default_factory=list)
    pinned_version: Optional[str] = None
    confidence: str = "experimental"  # experimental, beta, stable
    notes: str = ""
    card_type: str = "mode"

