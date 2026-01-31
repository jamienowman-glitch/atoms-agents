"""Atomic engine: AUDIO.INGEST.LOCAL_V1."""
from __future__ import annotations

import shutil
from pathlib import Path
from typing import List

from atoms_core.src.audio.core.ingest_local.types import IngestLocalInput, IngestLocalOutput


def run(config: IngestLocalInput) -> IngestLocalOutput:
    """Stage all files from source_dir into work_dir."""
    config.work_dir.mkdir(parents=True, exist_ok=True)
    staged: List[Path] = []

    # Legacy GCS logic removed

    for path in config.source_dir.rglob("*"):
        if path.is_file():
            rel = path.relative_to(config.source_dir)
            dest = config.work_dir / rel
            dest.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(path, dest)
            staged.append(dest)

    return IngestLocalOutput(staged_paths=staged, uploaded_urls=None)
