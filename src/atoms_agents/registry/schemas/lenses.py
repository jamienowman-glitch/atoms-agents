from dataclasses import dataclass, field
from typing import List, Optional, Dict, Any

@dataclass
class ContextLayerCard:
    """
    ContextLens: Deep Context Enabler.
    Projects style, brand voice, specialised manifests, and knowledge pointers onto a Node.
    """
    context_id: str
    name: str

    # Brand / Voice / Style
    style_guide_ref: Optional[str] = None
    voice_tone: Optional[str] = None

    # Deep Knowledge / Manifests
    manifest_refs: List[str] = field(default_factory=list)

    # Dynamic Data Injection (e.g. "latest_kpis", "user_session_summary")
    data_sources: List[str] = field(default_factory=list)

    notes: str = ""
    card_type: str = "lens_context"

@dataclass
class TokenMapCard:
    """
    CanvasLens / TokenLens: Token Scope & Targeting.
    Defines which shared state tokens (variables) a node can Read or Write.
    Crucial for "Collaborative Canvas" where agents target specific UI elements.
    """
    token_map_id: str
    target_node_id: str  # The node this map applies to

    # List of tokens this node can READ from the shared state
    read_tokens: List[str] = field(default_factory=list)

    # List of tokens this node can WRITE to (with optional target UI element)
    # Format: "token_name" or "token_name:ui_element_id"
    write_tokens: List[str] = field(default_factory=list)

    notes: str = ""
    card_type: str = "lens_token_map"

@dataclass
class SafetyProfileCard:
    """
    SafetyLens: Atomic Safety Allocation.
    Defines safety tiers and guardrails allocated to a node.
    """
    safety_id: str
    tier: str # "high", "medium", "low", "unrestricted"

    # Specific guardrail checks to enforce
    active_guardrails: List[str] = field(default_factory=list)

    # Fallback behavior if safety check fails
    fallback_action: str = "block" # "block", "redact", "warn"

    card_type: str = "lens_safety"

@dataclass
class LogPolicyCard:
    """
    LogLens: Configurable Recorder.
    Dictates what events get recorded and where.
    """
    policy_id: str

    # Event types to record (e.g. "invocation", "state_change", "error")
    # If empty, defaults may apply. "*" means all.
    record_events: List[str] = field(default_factory=list)

    # Destination (e.g. "console", "db", "file", "stream")
    destination: str = "console"

    # Sampling rate (0.0 to 1.0)
    sample_rate: float = 1.0

    card_type: str = "lens_log"

@dataclass
class InteractionStateCard:
    """
    ChatModeLens: Interaction State.
    Defines the 'Mode' of the chat rail (e.g. State of World, Debate, Research).
    """
    state_id: str
    mode_name: str # e.g. "recap", "debate", "research"

    # System prompt injection for this mode
    system_instruction: str = ""

    # Allowed user actions in this mode
    allowed_actions: List[str] = field(default_factory=list)

    card_type: str = "lens_interaction"
