"""Helpers for converting inline visual snapshots into artifact sidecars."""

from __future__ import annotations

import base64
import hashlib
import mimetypes
import re
import uuid
from pathlib import Path
from typing import Any, Dict, Optional

from atoms_agents.core.paths import get_artifacts_dir

_DATA_URI_PATTERN = re.compile(
    r"^data:(?P<mime>[^;]+);base64,(?P<data>[A-Za-z0-9+/=\s]+)$", re.IGNORECASE
)
_DEFAULT_MIME = "application/octet-stream"


def sanitize_canvas_event(payload: Dict[str, Any], *, artifacts_dir: Optional[Path] = None) -> Dict[str, Any]:
    """Replace inline base64 data URIs in the event with stored sidecar references."""
    if not isinstance(payload, dict):
        return payload
    artifacts_dir = artifacts_dir or get_artifacts_dir()
    _sanitize_value(payload, artifacts_dir)
    return payload


def _sanitize_value(value: Any, artifacts_dir: Path) -> Any:
    if isinstance(value, dict):
        for key, sub_value in list(value.items()):
            sanitized = _sanitize_value(sub_value, artifacts_dir)
            if sanitized is not sub_value:
                value[key] = sanitized
        return value
    if isinstance(value, list):
        for idx, item in enumerate(value):
            sanitized = _sanitize_value(item, artifacts_dir)
            if sanitized is not item:
                value[idx] = sanitized
        return value
    if isinstance(value, str):
        sidecar = _try_build_sidecar(value, artifacts_dir)
        if sidecar:
            return sidecar
    return value


def _try_build_sidecar(value: str, artifacts_dir: Path) -> Optional[Dict[str, Any]]:
    match = _DATA_URI_PATTERN.match(value.strip())
    if not match:
        return None
    mime_type = match.group("mime") or _DEFAULT_MIME
    raw_base64 = match.group("data").replace("\n", "").replace("\r", "")
    try:
        payload = base64.b64decode(raw_base64)
    except Exception:
        return None

    artifact_id = str(uuid.uuid4())
    extension = mimetypes.guess_extension(mime_type) or ".bin"
    filename = f"visual_snapshot_{artifact_id}{extension}"
    path = artifacts_dir / filename
    path.write_bytes(payload)
    uri = f"file://{path.resolve()}"

    return {
        "uri": uri,
        "artifact_id": artifact_id,
        "mime_type": mime_type,
        "size_bytes": len(payload),
        "checksum": hashlib.sha256(payload).hexdigest(),
    }
