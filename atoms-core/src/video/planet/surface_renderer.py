from __future__ import annotations

"""Planet surface renderer: generates glowing planetary surface frames with metadata."""

import hashlib
import io
import math
from typing import Any, Optional

import numpy as np
from PIL import Image

from .models import FrameDescriptor


class PlanetSurfaceRenderer:
    """Generates glowing planetary surface frames with per-frame metadata for preview pipelines."""

    def __init__(self, base_frame_rate: int = 24, sample_density: int = 16) -> None:
        self.base_frame_rate = base_frame_rate
        self.sample_density = sample_density

    def render(
        self, 
        surface_params: dict[str, Any], 
        duration_ms: int, 
        frame_rate: int | None = None,
        heatmap_payload: list[dict[str, Any]] | None = None,
    ) -> dict[str, Any]:
        """Render a sequence of hemisphere frames with metadata that preview muscles can consume."""
        target_rate = frame_rate or self.base_frame_rate
        frame_count = max(1, math.ceil((duration_ms / 1000.0) * target_rate))
        radius = float(surface_params.get("radius", 3390.0))
        glow_strength = float(surface_params.get("glow_strength", 0.8))
        atmosphere = float(surface_params.get("atmosphere", 0.3))
        render_instructions = self._build_equirectangular_texture(surface_params, radius, heatmap_payload)

        frames: list[dict[str, Any]] = []
        for index in range(frame_count):
            progress = index / max(1, frame_count - 1)
            timestamp_ms = int(progress * duration_ms)
            lighting = self._lighting_profile(progress, glow_strength, atmosphere)
            curvature = self._estimate_curvature(radius, progress)
            descriptor = FrameDescriptor(
                timestamp_ms=timestamp_ms,
                media_uri=self._frame_media_uri(surface_params, index),
                lighting=lighting,
                curvature=curvature,
                sample_chunk=self._slice_samples(render_instructions, index),
            )
            frames.append(descriptor.__dict__)

        return {
            "frames": frames,
            "metadata": {
                "surface_params": surface_params,
                "duration_ms": duration_ms,
                "frame_rate": target_rate,
                "atlas_hash": self._shader_fingerprint(render_instructions),
            },
        }

    def _build_equirectangular_texture(
        self,
        surface_params: dict[str, Any],
        radius: float,
        heatmap_payload: list[dict[str, Any]] | None = None
    ) -> np.ndarray:
        """Sample a simple equirectangular hemisphere mesh to drive preview textures."""
        sample_count = self.sample_density
        latitudes = np.linspace(0.0, math.pi / 2, sample_count)
        longitudes = np.linspace(0.0, 2 * math.pi, sample_count)
        lat_grid, lon_grid = np.meshgrid(latitudes, longitudes, indexing="ij")
        x = radius * np.cos(lat_grid) * np.cos(lon_grid)
        y = radius * np.cos(lat_grid) * np.sin(lon_grid)
        z = radius * np.sin(lat_grid)
        emissive = np.sin(lat_grid * 2) * surface_params.get("emissive_variation", 0.5)

        if heatmap_payload:
            for point in heatmap_payload:
                p_lat = point.get("lat", 0.0)
                p_lon = point.get("lon", 0.0)
                intensity = point.get("intensity", 0.5)
                # Map lat (0..pi/2) and lon (0..2pi) to grid indices
                lat_idx = int((p_lat / (math.pi / 2)) * (sample_count - 1))
                lon_idx = int((p_lon / (2 * math.pi)) * (sample_count - 1))
                # Clamp to be safe
                lat_idx = max(0, min(sample_count - 1, lat_idx))
                lon_idx = max(0, min(sample_count - 1, lon_idx))
                # Accumulate intensity (hotspots)
                emissive[lat_idx, lon_idx] += intensity

        curvature = (x**2 + y**2 + z**2) / radius**2
        texture = np.stack([x, y, z, emissive, curvature], axis=-1)
        return texture

    def _slice_samples(self, atlas: np.ndarray, frame_index: int) -> list[float]:
        """Provide a stable chunk of the atlas so each frame can reference a shrink-wrapped parcel."""
        flat = atlas.reshape(-1, atlas.shape[-1])
        sample_index = frame_index % flat.shape[0]
        slice_window = flat[sample_index : sample_index + 1]
        return slice_window.flatten().tolist()

    def _lighting_profile(self, progress: float, glow_strength: float, atmosphere: float) -> dict[str, float]:
        sun_angle = math.cos(progress * math.pi)
        emissive = (1.0 - atmosphere) * glow_strength + (atmosphere * progress)
        return {
            "sun_angle": sun_angle,
            "emissive": round(emissive, 3),
            "bloom": min(1.0, glow_strength + 0.1 * progress),
        }

    def _estimate_curvature(self, radius: float, progress: float) -> dict[str, float]:
        return {
            "radius": radius,
            "surface_variance": 1.0 + 0.3 * math.sin(progress * math.pi * 2),
        }

    def _frame_media_uri(self, surface_params: dict[str, Any], frame_index: int) -> str:
        slug = surface_params.get("slug") or self._slug_surface(surface_params)
        return f"media_v2://planet_surface/{slug}/frame_{frame_index:04d}"

    def _slug_surface(self, surface_params: dict[str, Any]) -> str:
        payload = f"{surface_params}-{surface_params.get('glow_strength', 0.0)}"
        return hashlib.sha1(payload.encode("utf-8")).hexdigest()[:8]

    def _shader_fingerprint(self, atlas: np.ndarray) -> str:
        hasher = hashlib.sha256()
        hasher.update(atlas.tobytes())
        return hasher.hexdigest()

    def render_with_assets(
        self,
        surface_params: dict[str, Any],
        duration_ms: int,
        tenant_id: str,
        env: str,
        user_id: Optional[str] = None,
        frame_rate: int | None = None,
        media_service: Optional[Any] = None,
        heatmap_payload: list[dict[str, Any]] | None = None,
    ) -> dict[str, Any]:
        """Production render: generates real PNG frames, uploads to S3, registers in media_v2.
        
        This is the server-side preview/export path. Interactive rendering stays on device.
        
        Args:
            surface_params: Planet surface parameters (radius, glow_strength, etc)
            duration_ms: Total duration in milliseconds
            tenant_id: Tenant ID for media_v2 registration
            env: Environment (prod/staging/dev)
            user_id: Optional user ID
            frame_rate: Optional frame rate override
            media_service: Optional MediaService instance (for testing)
            heatmap_payload: Optional list of points to visualize on the surface
        
        Returns:
            Dict with frames (containing real media_v2 asset IDs) and metadata
        """
        # Import here to avoid circular dependency
        if media_service is None:
            from atoms_core.src.media.v2.service import get_media_service
            from atoms_core.src.media.v2.models import MediaUploadRequest
            media_service = get_media_service()
            MediaUploadRequest_cls = MediaUploadRequest
        else:
            from atoms_core.src.media.v2.models import MediaUploadRequest as MediaUploadRequest_cls
        
        target_rate = frame_rate or self.base_frame_rate
        frame_count = max(1, math.ceil((duration_ms / 1000.0) * target_rate))
        radius = float(surface_params.get("radius", 3390.0))
        glow_strength = float(surface_params.get("glow_strength", 0.8))
        atmosphere = float(surface_params.get("atmosphere", 0.3))
        render_instructions = self._build_equirectangular_texture(surface_params, radius, heatmap_payload)
        
        slug = surface_params.get("slug") or self._slug_surface(surface_params)
        
        frames: list[dict[str, Any]] = []
        for index in range(frame_count):
            progress = index / max(1, frame_count - 1)
            timestamp_ms = int(progress * duration_ms)
            lighting = self._lighting_profile(progress, glow_strength, atmosphere)
            curvature = self._estimate_curvature(radius, progress)
            
            # Generate actual PNG frame
            frame_image = self._render_frame_image(render_instructions, progress, lighting)
            frame_bytes = self._image_to_png_bytes(frame_image)
            
            # Upload to S3 and register in media_v2
            upload_req = MediaUploadRequest_cls(
                tenant_id=tenant_id,
                env=env,
                user_id=user_id,
                kind="image",
                tags=["planet_surface", slug, f"frame_{index:04d}"],
                source_ref=f"planet_surface_{slug}",
                meta={
                    "surface_params": surface_params,
                    "frame_index": index,
                    "timestamp_ms": timestamp_ms,
                    "lighting": lighting,
                    "curvature": curvature,
                }
            )
            
            asset = media_service.register_upload(
                upload_req,
                filename=f"planet_surface_{slug}_frame_{index:04d}.png",
                content=frame_bytes
            )
            
            descriptor = FrameDescriptor(
                timestamp_ms=timestamp_ms,
                media_uri=f"media_v2://asset/{asset.id}",  # Real asset ID
                lighting=lighting,
                curvature=curvature,
                sample_chunk=self._slice_samples(render_instructions, index),
            )
            frames.append(descriptor.__dict__)
        
        return {
            "frames": frames,
            "metadata": {
                "surface_params": surface_params,
                "duration_ms": duration_ms,
                "frame_rate": target_rate,
                "atlas_hash": self._shader_fingerprint(render_instructions),
                "slug": slug,
            },
        }

    def _render_frame_image(self, atlas: np.ndarray, progress: float, lighting: dict[str, float]) -> np.ndarray:
        """Generate a single frame image from the atlas with lighting applied.
        
        Returns RGB numpy array (H, W, 3) with values 0-255.
        """
        # Extract emissive and curvature channels from atlas
        emissive_channel = atlas[:, :, 3]  # 4th channel
        curvature_channel = atlas[:, :, 4]  # 5th channel
        
        # Apply lighting to create glow effect
        glow = lighting["emissive"] * emissive_channel
        bloom = lighting["bloom"] * 0.5
        
        # Create RGB image with planetary glow
        r = np.clip((glow + bloom) * 255, 0, 255).astype(np.uint8)
        g = np.clip((glow * 0.8 + bloom * 0.6) * 255, 0, 255).astype(np.uint8)
        b = np.clip((glow * 0.6 + bloom * 0.9) * 255, 0, 255).astype(np.uint8)
        
        return np.stack([r, g, b], axis=-1)

    def _image_to_png_bytes(self, image_array: np.ndarray) -> bytes:
        """Convert numpy RGB array to PNG bytes."""
        img = Image.fromarray(image_array, mode='RGB')
        buffer = io.BytesIO()
        img.save(buffer, format='PNG', optimize=True)
        return buffer.getvalue()
