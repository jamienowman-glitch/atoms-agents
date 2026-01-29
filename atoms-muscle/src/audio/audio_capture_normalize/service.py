from __future__ import annotations

"""Audio capture normalization service for MAYBES UI."""

import io
import json
import logging
import subprocess
import tempfile
import uuid
from pathlib import Path
from typing import Any, Optional

import numpy as np

logger = logging.getLogger(__name__)


class AudioCaptureNormalizeService:
    """Normalize audio captures from MAYBES UI (microphone recordings, uploaded blobs).
    
    Different from audio_normalise which is for production audio processing.
    This service is optimized for quick capture processing with waveform extraction.
    """

    def __init__(self, target_sample_rate: int = 44100, target_lufs: float = -14.0):
        self.target_sample_rate = target_sample_rate
        self.target_lufs = target_lufs

    def normalize_capture(
        self,
        audio_blob: bytes,
        tenant_id: str,
        env: str,
        user_id: Optional[str] = None,
        filename: str = "capture.wav",
        media_service: Optional[Any] = None,
    ) -> dict[str, Any]:
        """Normalize uploaded audio blob for MAYBES UI.
        
        Args:
            audio_blob: Raw audio bytes from upload
            tenant_id: Tenant ID for media_v2 registration
            env: Environment (prod/staging/dev)
            user_id: Optional user ID
            filename: Original filename
            media_service: Optional MediaService instance (for testing)
            
        Returns:
            Dict with asset_id, uri, duration_ms, sample_rate, waveform, lufs
        """
        if not tenant_id or tenant_id == "t_unknown":
            raise ValueError("Valid tenant_id required")
        if not env:
            raise ValueError("Valid env required")
        if not audio_blob:
            raise ValueError("Audio blob required")

        # Import here to avoid circular dependency
        if media_service is None:
            from atoms_core.src.media.v2.service import get_media_service
            from atoms_core.src.media.v2.models import MediaUploadRequest
            media_service = get_media_service()
            MediaUploadRequest_cls = MediaUploadRequest
        else:
            from atoms_core.src.media.v2.models import MediaUploadRequest as MediaUploadRequest_cls

        # Create temp files for processing
        input_path = Path(tempfile.gettempdir()) / f"input_{uuid.uuid4().hex[:8]}.tmp"
        output_path = Path(tempfile.gettempdir()) / f"output_{uuid.uuid4().hex[:8]}.wav"

        try:
            # Write input blob to temp file
            input_path.write_bytes(audio_blob)

            # Detect format and get metadata
            metadata = self._probe_audio(input_path)
            
            # Normalize audio: resample + loudness normalization
            self._normalize_audio(input_path, output_path)

            # Extract waveform for UI visualization
            waveform = self._extract_waveform(output_path, num_samples=100)

            # Measure final loudness
            final_lufs = self._measure_lufs(output_path)

            # Upload to S3 and register in media_v2
            output_bytes = output_path.read_bytes()
            upload_req = MediaUploadRequest_cls(
                tenant_id=tenant_id,
                env=env,
                user_id=user_id,
                kind="audio",
                tags=["capture", "normalized", "maybes"],
                source_ref="maybes_capture",
                meta={
                    "original_filename": filename,
                    "sample_rate": self.target_sample_rate,
                    "lufs": final_lufs,
                    "duration_ms": metadata.get("duration_ms"),
                }
            )

            asset = media_service.register_upload(
                upload_req,
                filename=f"capture_{uuid.uuid4().hex[:8]}.wav",
                content=output_bytes
            )

            return {
                "asset_id": asset.id,
                "uri": asset.source_uri,
                "duration_ms": metadata.get("duration_ms"),
                "sample_rate": self.target_sample_rate,
                "waveform": waveform,
                "lufs": final_lufs,
                "size_bytes": len(output_bytes),
            }

        finally:
            # Cleanup temp files
            for path in [input_path, output_path]:
                if path.exists():
                    try:
                        path.unlink()
                    except Exception as exc:
                        logger.debug(f"Failed to cleanup {path}: {exc}")

    def _probe_audio(self, path: Path) -> dict[str, Any]:
        """Probe audio file for metadata using ffprobe."""
        cmd = [
            "ffprobe",
            "-v", "error",
            "-show_entries", "format=duration,bit_rate",
            "-show_entries", "stream=sample_rate,channels",
            "-of", "json",
            str(path),
        ]
        
        try:
            result = subprocess.run(cmd, capture_output=True, text=True, check=True)
            data = json.loads(result.stdout)
            
            duration_ms = None
            if "format" in data and "duration" in data["format"]:
                duration_ms = float(data["format"]["duration"]) * 1000
            
            sample_rate = None
            channels = None
            if "streams" in data and data["streams"]:
                stream = data["streams"][0]
                sample_rate = int(stream.get("sample_rate", 0)) if "sample_rate" in stream else None
                channels = int(stream.get("channels", 0)) if "channels" in stream else None
            
            return {
                "duration_ms": duration_ms,
                "sample_rate": sample_rate,
                "channels": channels,
            }
        except Exception as exc:
            logger.warning(f"Failed to probe audio: {exc}")
            return {}

    def _normalize_audio(self, input_path: Path, output_path: Path) -> None:
        """Normalize audio: resample to target sample rate + loudness normalization."""
        # Two-pass loudnorm for accurate normalization
        # Pass 1: Measure
        cmd_measure = [
            "ffmpeg",
            "-i", str(input_path),
            "-af", f"loudnorm=I={self.target_lufs}:print_format=json",
            "-f", "null",
            "-"
        ]
        
        try:
            result = subprocess.run(cmd_measure, capture_output=True, text=True, check=False)
            # Extract JSON from stderr (ffmpeg outputs to stderr)
            stderr = result.stderr
            # Find JSON block in stderr
            json_start = stderr.rfind("{")
            if json_start != -1:
                json_str = stderr[json_start:]
                measured = json.loads(json_str)
            else:
                measured = {}
        except Exception as exc:
            logger.warning(f"Loudnorm measurement failed: {exc}, using single-pass")
            measured = {}

        # Pass 2: Apply normalization
        if measured:
            # Use measured values for accurate normalization
            loudnorm_filter = (
                f"loudnorm=I={self.target_lufs}:"
                f"measured_I={measured.get('input_i', self.target_lufs)}:"
                f"measured_LRA={measured.get('input_lra', 7.0)}:"
                f"measured_TP={measured.get('input_tp', -1.5)}:"
                f"measured_thresh={measured.get('input_thresh', -70.0)}"
            )
        else:
            # Single-pass normalization
            loudnorm_filter = f"loudnorm=I={self.target_lufs}"

        cmd_normalize = [
            "ffmpeg",
            "-i", str(input_path),
            "-af", f"aresample={self.target_sample_rate},{loudnorm_filter}",
            "-ar", str(self.target_sample_rate),
            "-ac", "2",  # Stereo
            "-y",  # Overwrite
            str(output_path),
        ]

        subprocess.run(cmd_normalize, capture_output=True, check=True)

    def _extract_waveform(self, path: Path, num_samples: int = 100) -> list[float]:
        """Extract waveform data for UI visualization."""
        try:
            # Use ffmpeg to extract raw PCM data
            cmd = [
                "ffmpeg",
                "-i", str(path),
                "-f", "f32le",  # 32-bit float PCM
                "-ac", "1",  # Mono
                "-"
            ]
            
            result = subprocess.run(cmd, capture_output=True, check=True)
            audio_data = np.frombuffer(result.stdout, dtype=np.float32)
            
            if len(audio_data) == 0:
                return [0.0] * num_samples
            
            # Downsample to num_samples by taking max absolute value in each chunk
            chunk_size = max(1, len(audio_data) // num_samples)
            waveform = []
            
            for i in range(num_samples):
                start = i * chunk_size
                end = min(start + chunk_size, len(audio_data))
                if start < len(audio_data):
                    chunk = audio_data[start:end]
                    waveform.append(float(np.max(np.abs(chunk))))
                else:
                    waveform.append(0.0)
            
            return waveform
        except Exception as exc:
            logger.warning(f"Waveform extraction failed: {exc}")
            return [0.0] * num_samples

    def _measure_lufs(self, path: Path) -> Optional[float]:
        """Measure integrated loudness (LUFS) of audio file."""
        cmd = [
            "ffmpeg",
            "-i", str(path),
            "-af", "loudnorm=print_format=json",
            "-f", "null",
            "-"
        ]
        
        try:
            result = subprocess.run(cmd, capture_output=True, text=True, check=False)
            stderr = result.stderr
            json_start = stderr.rfind("{")
            if json_start != -1:
                json_str = stderr[json_start:]
                data = json.loads(json_str)
                return float(data.get("output_i", self.target_lufs))
        except Exception as exc:
            logger.warning(f"LUFS measurement failed: {exc}")
        
        return None

    def run(self, input_path: str, **kwargs: Any) -> dict[str, Any]:
        """MCP entry point."""
        # For MCP, we expect audio_blob as base64 or bytes in kwargs
        import base64
        
        audio_blob_b64 = kwargs.get("audio_blob")
        if isinstance(audio_blob_b64, str):
            audio_blob = base64.b64decode(audio_blob_b64)
        elif isinstance(audio_blob_b64, bytes):
            audio_blob = audio_blob_b64
        else:
            raise ValueError("audio_blob required (base64 string or bytes)")
        
        return self.normalize_capture(
            audio_blob=audio_blob,
            tenant_id=kwargs.get("tenant_id"),
            env=kwargs.get("env", "prod"),
            user_id=kwargs.get("user_id"),
            filename=kwargs.get("filename", "capture.wav"),
        )
