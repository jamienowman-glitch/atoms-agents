from dataclasses import dataclass, field
from typing import List, Optional, Any, Dict

@dataclass
class FrameworkAdapterCard:
    framework_id: str  # e.g. "autogen", "crewai"
    adapter_import_path: str  # e.g. "northstar.runtime.adapters.autogen_adapter"

@dataclass
class ModeCard:
    id: str  # e.g. "autogen-basic"
    framework: str  # e.g. "autogen"
    official_name: str  # e.g. "AutoGen Basic Chat"
    invoke_primitive: str  # e.g. "single_turn", "chat_loop"
    entrypoint: str  # e.g. "northstar.runtime.modes.autogen.basic.run"
    
    # Optional fields with defaults
    params: Dict[str, Any] = field(default_factory=dict)
    streaming_support: bool = False
    docs_urls: List[str] = field(default_factory=list)
    pinned_version: Optional[str] = None
    confidence: str = "experimental"  # experimental, beta, stable
    notes: str = ""
    card_type: str = "mode"
