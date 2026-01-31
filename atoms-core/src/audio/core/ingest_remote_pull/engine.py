"""Atomic engine: AUDIO.INGEST.REMOTE_PULL_V1."""
from __future__ import annotations

import shutil
import urllib.request
from pathlib import Path
from typing import List

from atoms_core.src.audio.core.ingest_remote_pull.types import IngestRemotePullInput, IngestRemotePullOutput


def _download(uri: str, dest: Path) -> None:
    with urllib.request.urlopen(uri) as response, dest.open("wb") as out:  # nosec B310
        shutil.copyfileobj(response, out)


def run(config: IngestRemotePullInput) -> IngestRemotePullOutput:
    """Fetch remote resources into dest_dir."""
    config.dest_dir.mkdir(parents=True, exist_ok=True)
    downloaded: List[Path] = []

    # Legacy GCS upload removed

    for uri in config.uris:
        filename = Path(uri).name or "downloaded"
        dest_path = config.dest_dir / filename
        _download(uri, dest_path)
        downloaded.append(dest_path)

    return IngestRemotePullOutput(downloaded=downloaded, uploaded_urls=None)
