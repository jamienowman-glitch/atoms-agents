"""Sanitizer gate ensuring heavy assets never reach durable stores."""

from __future__ import annotations

import hashlib
import logging
import re
from collections.abc import Mapping, Sequence
from typing import Any, Dict, Optional

from engines.dataset.events.schemas import DatasetEvent

logger = logging.getLogger(__name__)

BASE64_CHARSET = frozenset("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=")
MAX_INLINE_BYTES = 2 * 1024  # 2KB
BASE64_MIN_CHARS = 64


class SanitizerGate:
    """Strips or redacts large/base64 payloads before persistence."""

    def __init__(self, max_inline_bytes: int = MAX_INLINE_BYTES, base64_min_chars: int = BASE64_MIN_CHARS) -> None:
        self._max_inline = max_inline_bytes
        self._base64_min_chars = base64_min_chars

    def sanitize_event(self, event: DatasetEvent) -> None:
        """In-place sanitize the canonical DatasetEvent structure."""
        event.input = self._sanitize_value(event.input, "input")
        event.output = self._sanitize_value(event.output, "output")
        event.metadata = self._sanitize_value(event.metadata, "metadata")

    def _sanitize_value(self, value: Any, path: str) -> Any:
        if isinstance(value, str):
            return self._sanitize_string(value, path)
        if isinstance(value, (bytes, bytearray)):
            raw_bytes = bytes(value)
            return self._redact_bytes(raw_bytes, path, reason="bytes")
        if isinstance(value, Mapping):
            if self._is_redacted_marker(value):
                return value
            return {
                key: self._sanitize_value(val, f"{path}.{key}" if path else key)
                for key, val in value.items()
            }
        if isinstance(value, Sequence) and not isinstance(value, (str, bytes, bytearray)):
            return [
                self._sanitize_value(item, f"{path}[{idx}]")
                for idx, item in enumerate(value)
            ]
        return value

    def _sanitize_string(self, value: str, path: str) -> Any:
        raw_bytes = value.encode("utf-8", errors="surrogatepass")
        if len(raw_bytes) <= self._max_inline and not self._looks_like_base64(value):
            return value
        return self._redact_bytes(raw_bytes, path, reason="size" if len(raw_bytes) > self._max_inline else "base64")

    def _redact_bytes(self, raw_bytes: bytes, path: str, *, reason: str) -> Dict[str, Any]:
        digest = hashlib.sha256(raw_bytes).hexdigest()
        logger.info("SanitizerGate redacted %s (%s, %d bytes)", path, reason, len(raw_bytes))
        return {
            "redacted": True,
            "original_size": len(raw_bytes),
            "sha256": digest,
            "uri": None,
        }

    def _looks_like_base64(self, value: str) -> bool:
        cleaned = re.sub(r"\s+", "", value)
        if len(cleaned) < self._base64_min_chars:
            return False
        if len(cleaned) % 4 not in (0, 2):
            return False
        if any(ch not in BASE64_CHARSET for ch in cleaned):
            return False
        return True

    @staticmethod
    def _is_redacted_marker(value: Mapping[str, Any]) -> bool:
        return bool(value.get("redacted") and "original_size" in value and "sha256" in value)


_default_gate = SanitizerGate()


def sanitize_dataset_event(event: DatasetEvent) -> DatasetEvent:
    """Convenience helper to sanitize the dataset event inline."""
    _default_gate.sanitize_event(event)
    return event
