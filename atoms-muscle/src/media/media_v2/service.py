from __future__ import annotations

"""Thin MCP wrapper over atoms_core media_v2 service for MAYBES UI."""

import logging
from typing import Any, List, Optional

from atoms_core.src.media.v2.service import MediaService, get_media_service
from atoms_core.src.media.v2.models import (
    MediaUploadRequest,
    MediaAsset,
    DerivedArtifact,
    MediaKind,
)

logger = logging.getLogger(__name__)


class MediaV2Service:
    """Thin wrapper over atoms_core media_v2 service for MAYBES UI.
    
    Provides clear error handling and validation for media asset operations.
    """

    def __init__(self, media_service: Optional[MediaService] = None):
        self.media_service = media_service or get_media_service()

    def upload_asset(
        self,
        file_content: bytes,
        filename: str,
        tenant_id: str,
        env: str,
        kind: str = "other",
        user_id: Optional[str] = None,
        tags: Optional[List[str]] = None,
        source_ref: Optional[str] = None,
        meta: Optional[dict[str, Any]] = None,
    ) -> dict[str, Any]:
        """Upload file and register as media asset.
        
        Args:
            file_content: File bytes to upload
            filename: Original filename
            tenant_id: Tenant ID (required)
            env: Environment (prod/staging/dev)
            kind: Media kind (audio/video/image/other)
            user_id: Optional user ID
            tags: Optional tags for asset
            source_ref: Optional source reference
            meta: Optional metadata
            
        Returns:
            Dict with asset details (id, uri, kind, size_bytes, etc.)
            
        Raises:
            ValueError: If required fields missing or invalid
            RuntimeError: If upload/registration fails
        """
        # Validation
        if not file_content:
            raise ValueError("file_content required")
        if not filename:
            raise ValueError("filename required")
        if not tenant_id or tenant_id == "t_unknown":
            raise ValueError("Valid tenant_id required")
        if not env:
            raise ValueError("env required (prod/staging/dev)")
        if kind not in ["audio", "video", "image", "other"]:
            raise ValueError(f"Invalid kind: {kind}. Must be audio/video/image/other")

        try:
            upload_req = MediaUploadRequest(
                tenant_id=tenant_id,
                env=env,
                user_id=user_id,
                kind=kind,
                source_uri="pending",  # Will be set by media service
                tags=tags or [],
                source_ref=source_ref,
                meta=meta or {},
            )

            asset = self.media_service.register_upload(upload_req, filename, file_content)
            
            return {
                "id": asset.id,
                "tenant_id": asset.tenant_id,
                "env": asset.env,
                "user_id": asset.user_id,
                "kind": asset.kind,
                "source_uri": asset.source_uri,
                "duration_ms": asset.duration_ms,
                "fps": asset.fps,
                "audio_channels": asset.audio_channels,
                "sample_rate": asset.sample_rate,
                "codec_info": asset.codec_info,
                "size_bytes": asset.size_bytes,
                "tags": asset.tags,
                "source_ref": asset.source_ref,
                "meta": asset.meta,
                "created_at": asset.created_at.isoformat() if asset.created_at else None,
            }
        except Exception as exc:
            logger.error(f"Failed to upload asset: {exc}")
            raise RuntimeError(f"Upload failed: {exc}") from exc

    def get_asset(self, asset_id: str) -> Optional[dict[str, Any]]:
        """Get asset by ID.
        
        Args:
            asset_id: Asset ID
            
        Returns:
            Dict with asset details or None if not found
        """
        if not asset_id:
            raise ValueError("asset_id required")

        try:
            asset = self.media_service.get_asset(asset_id)
            if not asset:
                return None

            return {
                "id": asset.id,
                "tenant_id": asset.tenant_id,
                "env": asset.env,
                "user_id": asset.user_id,
                "kind": asset.kind,
                "source_uri": asset.source_uri,
                "duration_ms": asset.duration_ms,
                "fps": asset.fps,
                "audio_channels": asset.audio_channels,
                "sample_rate": asset.sample_rate,
                "codec_info": asset.codec_info,
                "size_bytes": asset.size_bytes,
                "tags": asset.tags,
                "source_ref": asset.source_ref,
                "meta": asset.meta,
                "created_at": asset.created_at.isoformat() if asset.created_at else None,
            }
        except Exception as exc:
            logger.error(f"Failed to get asset {asset_id}: {exc}")
            raise RuntimeError(f"Get asset failed: {exc}") from exc

    def list_assets(
        self,
        tenant_id: str,
        kind: Optional[str] = None,
        tag: Optional[str] = None,
        source_ref: Optional[str] = None,
    ) -> List[dict[str, Any]]:
        """List assets for tenant.
        
        Args:
            tenant_id: Tenant ID (required)
            kind: Optional filter by kind (audio/video/image/other)
            tag: Optional filter by tag
            source_ref: Optional filter by source_ref
            
        Returns:
            List of asset dicts
        """
        if not tenant_id or tenant_id == "t_unknown":
            raise ValueError("Valid tenant_id required")

        try:
            assets = self.media_service.list_assets(
                tenant_id=tenant_id,
                kind=kind,
                tag=tag,
                source_ref=source_ref,
            )

            return [
                {
                    "id": asset.id,
                    "tenant_id": asset.tenant_id,
                    "env": asset.env,
                    "user_id": asset.user_id,
                    "kind": asset.kind,
                    "source_uri": asset.source_uri,
                    "duration_ms": asset.duration_ms,
                    "fps": asset.fps,
                    "audio_channels": asset.audio_channels,
                    "sample_rate": asset.sample_rate,
                    "codec_info": asset.codec_info,
                    "size_bytes": asset.size_bytes,
                    "tags": asset.tags,
                    "source_ref": asset.source_ref,
                    "meta": asset.meta,
                    "created_at": asset.created_at.isoformat() if asset.created_at else None,
                }
                for asset in assets
            ]
        except Exception as exc:
            logger.error(f"Failed to list assets for tenant {tenant_id}: {exc}")
            raise RuntimeError(f"List assets failed: {exc}") from exc

    def run(self, input_path: str, **kwargs: Any) -> dict[str, Any]:
        """MCP entry point.
        
        Supports multiple operations via 'operation' kwarg:
        - upload: Upload and register asset
        - get: Get asset by ID
        - list: List assets for tenant
        """
        operation = kwargs.get("operation", "upload")

        if operation == "upload":
            import base64
            
            file_content_b64 = kwargs.get("file_content")
            if isinstance(file_content_b64, str):
                file_content = base64.b64decode(file_content_b64)
            elif isinstance(file_content_b64, bytes):
                file_content = file_content_b64
            else:
                raise ValueError("file_content required (base64 string or bytes)")

            return self.upload_asset(
                file_content=file_content,
                filename=kwargs.get("filename", "upload.bin"),
                tenant_id=kwargs.get("tenant_id"),
                env=kwargs.get("env", "prod"),
                kind=kwargs.get("kind", "other"),
                user_id=kwargs.get("user_id"),
                tags=kwargs.get("tags"),
                source_ref=kwargs.get("source_ref"),
                meta=kwargs.get("meta"),
            )

        elif operation == "get":
            result = self.get_asset(asset_id=kwargs.get("asset_id"))
            if result is None:
                return {"error": "not_found", "detail": "Asset not found"}
            return result

        elif operation == "list":
            return {
                "assets": self.list_assets(
                    tenant_id=kwargs.get("tenant_id"),
                    kind=kwargs.get("kind"),
                    tag=kwargs.get("tag"),
                    source_ref=kwargs.get("source_ref"),
                )
            }

        else:
            raise ValueError(f"Unknown operation: {operation}. Must be upload/get/list")
