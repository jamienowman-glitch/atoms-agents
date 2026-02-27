from dataclasses import dataclass, field
from typing import List


@dataclass
class LogPolicyCard:
    """
    LogLens: Configurable Recorder.
    Dictates what events get recorded and where.
    """
    policy_id: str
    record_events: List[str] = field(default_factory=list)
    destination: str = "console"
    sample_rate: float = 1.0
    card_type: str = "lens_log"

