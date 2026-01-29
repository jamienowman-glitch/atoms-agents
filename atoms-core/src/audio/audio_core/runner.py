"""Audio core dev runner: preprocess -> beats -> ASR -> dataset -> LoRA (stub)."""
from __future__ import annotations

from pathlib import Path
from typing import Dict, Any
import subprocess

from engines.audio.preprocess_basic_clean.engine import run as run_clean
from engines.audio.preprocess_basic_clean.types import PreprocessBasicCleanInput
from engines.audio.beat_features.engine import run as run_beats
from engines.audio.beat_features.types import BeatFeaturesInput
from atoms_core.src.audio.audio_core import asr_backend, dataset_builder, lora_train


def _ensure_consistent_sample_rate(paths: list[Path], work_dir: Path, target_sr: int = 16000) -> list[Path]:
    """Ensure all audio files are at the target sample rate (default 16k for ASR/ML)."""
    out_dir = work_dir / "normalized_sr"
    out_dir.mkdir(parents=True, exist_ok=True)
    normalized = []

    for p in paths:
        # Check current SR (simple probe) or just force resample
        # For hardening, we assume everything might be broken, so force resample is safer and consistent.
        out_path = out_dir / f"{p.stem}_{target_sr}hz.wav"
        if not out_path.exists():
            try:
                subprocess.run(
                    ["ffmpeg", "-y", "-v", "error", "-i", str(p), "-ar", str(target_sr), "-ac", "1", str(out_path)],
                    check=True, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE
                )
            except subprocess.CalledProcessError as e:
                # Log warning but continue with original if ffmpeg fails (maybe not audio?)
                print(f"WARN: Failed to resample {p}: {e}")
                normalized.append(p)
                continue
        normalized.append(out_path)
    return normalized


def run_pipeline(raw_dir: Path, work_dir: Path, lora_config: Path | None = None) -> Dict[str, Any]:
    work_dir.mkdir(parents=True, exist_ok=True)
    raw_audio_files = sorted([p for p in raw_dir.iterdir() if p.is_file()])

    # HARDENING: Normalize audio before processing
    audio_files = _ensure_consistent_sample_rate(raw_audio_files, work_dir)

    clean_out = work_dir / "clean"
    clean_res = run_clean(PreprocessBasicCleanInput(input_paths=audio_files, output_dir=clean_out))

    beats = run_beats(BeatFeaturesInput(audio_paths=clean_res.cleaned_paths))

    asr_results = asr_backend.transcribe_audio(clean_res.cleaned_paths)

    ds_dir = work_dir / "dataset"
    ds_info = dataset_builder.build_dataset(asr_results, ds_dir)

    train_info = None
    if lora_config:
        train_info = lora_train.train_lora(lora_config)

    return {
        "cleaned": clean_res.cleaned_paths,
        "beats": beats.features,
        "asr": asr_results,
        "dataset": ds_info,
        "lora": train_info,
    }
