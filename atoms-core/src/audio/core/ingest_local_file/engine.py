"""Atomic engine: AUDIO.INGEST.LOCAL_FILE_V1."""
from __future__ import annotations

import shutil
from pathlib import Path
from typing import List

from atoms_core.src.audio.core.ingest_local_file.types import IngestLocalFileInput, IngestLocalFileOutput


def run(config: IngestLocalFileInput) -> IngestLocalFileOutput:
    """Stage local files into the destination directory."""
    config.dest_dir.mkdir(parents=True, exist_ok=True)
    staged: List[Path] = []
    uploaded: List[str] = []

    # Legacy GCS upload removed

    for src in config.files:
        dst = config.dest_dir / src.name
        shutil.copy2(src, dst)
        staged.append(dst)

    return IngestLocalFileOutput(staged_files=staged, uploaded_urls=None)
