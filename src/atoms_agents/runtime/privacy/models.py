from enum import Enum
from dataclasses import dataclass, field
from typing import List, Dict, Any, Optional

class PiiType(str, Enum):
    """Types of PII to detect and scrub."""
    EMAIL = "EMAIL"
    PHONE = "PHONE"
    SSN = "SSN"
    CREDIT_CARD = "CREDIT_CARD"
    IP_ADDRESS = "IP_ADDRESS"
    UNKNOWN = "UNKNOWN"

@dataclass
class PiiMatch:
    """Represents a detected PII instance."""
    pii_type: PiiType
    value: str
    start: int
    end: int
    score: float = 1.0

@dataclass
class ScrubResult:
    """Result of a scrubbing operation."""
    cleaned_text: str
    pii_found: bool = False
    matches: List[PiiMatch] = field(default_factory=list)
    metadata: Dict[str, Any] = field(default_factory=dict)

@dataclass
class StructureScrubResult:
    """Result of scrubbing a complex structure (dict/list)."""
    cleaned_structure: Any
    pii_found: bool = False
    summary: Dict[str, int] = field(default_factory=dict)  # Counts per PiiType
