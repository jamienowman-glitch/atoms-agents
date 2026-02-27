from typing import Any, Dict, List, Union
from .models import ScrubResult, StructureScrubResult, PiiType
from .detectors import PiiDetector
from .tokenizer import PiiTokenizer

class PiiScrubber:
    """
    Core scrubber logic for text.
    """
    def __init__(self, detector: PiiDetector = None, tokenizer: PiiTokenizer = None):
        self.detector = detector or PiiDetector()
        self.tokenizer = tokenizer or PiiTokenizer()

    def scrub_text(self, text: str) -> ScrubResult:
        """
        Detects and replaces PII in a string.
        """
        matches = self.detector.detect(text)
        if not matches:
            return ScrubResult(cleaned_text=text, pii_found=False)

        # Replace from end to start to avoid index shifting
        # Note: simplistic approach, assume no overlaps for now.
        # Overlap handling would require more complex interval merging.
        # Given patterns, overlaps are possible (e.g. phone in generic number).
        # We take a simple greedy approach: sort by start, if overlap, skip or merge.
        # But we previously sorted by start.
        
        # Let's do a reconstruction
        cleaned = []
        last_pos = 0
        matches_found = []
        
        # Filter overlapping matches (keep first one)
        filtered_matches = []
        last_end = -1
        for m in matches:
            if m.start >= last_end:
                filtered_matches.append(m)
                last_end = m.end
        
        for m in filtered_matches:
            cleaned.append(text[last_pos:m.start])
            token = self.tokenizer.tokenize(m.pii_type, m.value)
            cleaned.append(token)
            last_pos = m.end
            matches_found.append(m)
            
        cleaned.append(text[last_pos:])
        
        return ScrubResult(
            cleaned_text="".join(cleaned),
            pii_found=True,
            matches=matches_found
        )


class RecursiveScrubber:
    """
    Traverses complex structures and scrubs strings within them.
    """
    def __init__(self, scrubber: PiiScrubber = None):
        self.scrubber = scrubber or PiiScrubber()

    def scrub(self, data: Any) -> StructureScrubResult:
        """
        Recursively scrub a dict, list, or string.
        Returns the cleaned structure and metadata about what was found.
        """
        summary = {}
        pii_found_any = False

        def _recurse(item: Any):
            nonlocal pii_found_any
            if isinstance(item, str):
                res = self.scrubber.scrub_text(item)
                if res.pii_found:
                    pii_found_any = True
                    for m in res.matches:
                        summary[m.pii_type.value] = summary.get(m.pii_type.value, 0) + 1
                    return res.cleaned_text
                return item
            
            if isinstance(item, dict):
                return {k: _recurse(v) for k, v in item.items()}
            
            if isinstance(item, list):
                return [_recurse(i) for i in item]
            
            if isinstance(item, tuple):
                return tuple(_recurse(i) for i in item)

            # Pass through other types (int, float, bool, None)
            return item

        cleaned_data = _recurse(data)
        return StructureScrubResult(
            cleaned_structure=cleaned_data,
            pii_found=pii_found_any,
            summary=summary
        )
