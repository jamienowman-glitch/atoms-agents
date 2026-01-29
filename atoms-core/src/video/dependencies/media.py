from __future__ import annotations

from typing import List, Optional, Protocol

from .media_models import (
    ArtifactCreateRequest,
    DerivedArtifact,
    MediaAsset,
    MediaUploadRequest,
)


class MediaServiceProtocol(Protocol):
    def get_asset(self, asset_id: str) -> Optional[MediaAsset]: ...

    def list_artifacts_for_asset(self, asset_id: str) -> List[DerivedArtifact]: ...

    def register_artifact(self, req: ArtifactCreateRequest) -> DerivedArtifact: ...

    def register_remote(self, req: MediaUploadRequest) -> MediaAsset: ...

    def get_artifact(self, artifact_id: str) -> Optional[DerivedArtifact]: ...


_service: Optional[MediaServiceProtocol] = None


def get_media_service() -> MediaServiceProtocol:
    if _service is None:
        raise RuntimeError("MediaService not initialized. Call set_media_service first.")
    return _service


def set_media_service(service: MediaServiceProtocol) -> None:
    global _service
    _service = service
