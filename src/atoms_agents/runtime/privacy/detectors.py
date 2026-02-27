import re
from typing import List, Pattern, Dict
from .models import PiiType, PiiMatch

class PiiDetector:
    """
    Detects PII in text using regex patterns.
    """
    
    # Pre-compiled patterns
    PATTERNS: Dict[PiiType, List[Pattern]] = {
        PiiType.EMAIL: [
            re.compile(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b')
        ],
        PiiType.PHONE: [
            # Basic US phone patterns, allow space/dot/dash separator
            re.compile(r'\b(?:\+?1[-. ]?)?\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})\b')
        ],
        PiiType.SSN: [
            # US SSN: AAA-GG-SSSS
            re.compile(r'\b(?!000|666|9\d{2})([0-9]{3})-(?!00)([0-9]{2})-(?!0000)([0-9]{4})\b')
        ],
        PiiType.CREDIT_CARD: [
            # Basic Luhn-like pattern check is expensive, strictly catching 13-19 digits usually blocked
            # Simple groupings
            re.compile(r'\b(?:\d{4}[- ]?){3}\d{4}\b')
        ],
        PiiType.IP_ADDRESS: [
             re.compile(r'\b(?:\d{1,3}\.){3}\d{1,3}\b')
        ]
    }

    def detect(self, text: str) -> List[PiiMatch]:
        """
        Scan text for all configured PII types.
        """
        if not text:
            return []

        matches = []
        for pii_type, patterns in self.PATTERNS.items():
            for pattern in patterns:
                for m in pattern.finditer(text):
                    matches.append(PiiMatch(
                        pii_type=pii_type,
                        value=m.group(),
                        start=m.start(),
                        end=m.end()
                    ))
        
        # Sort matches by start position to help with replacement
        matches.sort(key=lambda x: x.start)
        return matches
