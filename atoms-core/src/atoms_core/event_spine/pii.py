"""
PII Redaction and Rehydration logic.
"""
import re
from uuid import uuid4
from typing import Dict, Any, List, Tuple

# Simple regex for demonstration (Email)
EMAIL_REGEX = r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+"

def _generate_token() -> str:
    return f"pii_{uuid4().hex[:8]}"

def redact_payload(payload: Dict[str, Any]) -> Tuple[Dict[str, Any], List[Dict[str, str]]]:
    """
    Recursively scans payload for PII, replaces with tokens,
    and returns (redacted_payload, list_of_tokens).

    Returns:
        (redacted_dict, [{"token_key": "...", "raw_value": "...", "category": "email"}])
    """
    tokens = []

    def _recurse(item: Any) -> Any:
        if isinstance(item, dict):
            return {k: _recurse(v) for k, v in item.items()}
        elif isinstance(item, list):
            return [_recurse(i) for i in item]
        elif isinstance(item, str):
            # Scan for Email
            matches = re.findall(EMAIL_REGEX, item)
            new_item = item
            for match in matches:
                # Check if already tokenized (prevent double redaction)
                if match.startswith("pii_") or "{{" in match: continue

                token_key = _generate_token()
                tokens.append({
                    "token_key": token_key,
                    "raw_value": match,
                    "category": "email"
                })
                new_item = new_item.replace(match, f"{{{{{token_key}}}}}")
            return new_item
        else:
            return item

    if not payload:
        return {}, []

    redacted = _recurse(payload)
    return redacted, tokens

def rehydrate_payload(payload: Dict[str, Any], token_map: Dict[str, str]) -> Dict[str, Any]:
    """
    Replaces tokens in payload with raw values from token_map.
    token_map is {token_key: raw_value}
    """
    def _recurse(item: Any) -> Any:
        if isinstance(item, dict):
            return {k: _recurse(v) for k, v in item.items()}
        elif isinstance(item, list):
            return [_recurse(i) for i in item]
        elif isinstance(item, str):
            new_item = item
            # Find all {{pii_...}}
            pattern = r"\{\{(pii_[a-f0-9]+)\}\}"
            matches = re.findall(pattern, item)

            for token_key in matches:
                if token_key in token_map:
                    new_item = new_item.replace(f"{{{{{token_key}}}}}", token_map[token_key])

            return new_item
        else:
            return item

    if not payload:
        return {}

    return _recurse(payload)
