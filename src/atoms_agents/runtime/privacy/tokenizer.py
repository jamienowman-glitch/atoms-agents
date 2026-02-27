import hmac
import hashlib
from typing import Optional
from .models import PiiType

class PiiTokenizer:
    """
    Handles deterministic token replacement for PII.
    Useful for rehydration in future phases.
    """

    def tokenize(self, pii_type: PiiType, value: str, salt: Optional[str] = None) -> str:
        """
        Returns a deterministic substitution token for the given PII.
        Format: [TYPE:hash_prefix]
        """
        # Ensure value is string
        val_bytes = str(value).strip().encode('utf-8')
        salt_bytes = (salt or "default_pii_salt").encode('utf-8')
        
        # Deterministic HMAC-SHA256
        h = hmac.new(salt_bytes, val_bytes, hashlib.sha256)
        digest = h.hexdigest()[:12] # Use 12 chars of hash for token
        
        return f"[{pii_type.value}:{digest}]"
