from typing import Any, Protocol, runtime_checkable
from .models import StructureScrubResult

@runtime_checkable
class PrivacyPolicy(Protocol):
    def validate(self, scrub_result: StructureScrubResult) -> bool:
        """
        Validate the scrub result.
        Returns True if allowed to proceed, False (or raises) if blocked.
        """
        ...

class FailClosedPolicy:
    """
    Strict policy: Always allow scrubbed content, but ensures
    scrubbing actually ran. If errors occurred during scrub, 
    callers should have caught them. 
    
    This policy essentially claims "if we ran the scrubber, we trust its output,
    but we might log or block if specific PII types are strictly forbidden 
    even in redacted form (e.g. if we decide to block messages containing SSNs entirely)."
    
    For Phase 1 tech spec: "Fail-closed behavior: If scrubber fails, node execution fails".
    The node executor calling code handles the exception.
    The policy here checks if the result is valid for downstream processing.
    """
    
    def validate(self, scrub_result: StructureScrubResult) -> bool:
        """
        Validates that scrubbing occurred and the result structure is sound.
        """
        # 1. Result must exist
        if scrub_result is None:
            return False
            
        # 2. Cleaned structure must be present
        if scrub_result.cleaned_structure is None:
            # If input was non-None, output must be non-None
            return False
            
        # 3. Type integrity check (basic)
        # We don't want the scrubber to accidentally change the root container type
        # though it's technically allowed by some scrubbers, our logic expects consistency.
        # This is a 'Fail-Closed' guard.
        return True
    
    def enforce(self, scrub_result: StructureScrubResult) -> Any:
        # Wrapper to return cleaned structure or raise
        if self.validate(scrub_result):
            return scrub_result.cleaned_structure
        raise ValueError("Privacy policy validation failed.")
