from __future__ import annotations

from typing import List, Optional

from ..models import RenderPlan


class FFmpegError(RuntimeError):
    def __init__(self, message: str, *, stage: str = "ffmpeg", stderr_tail: str | None = None, hint: str | None = None):
        super().__init__(message)
        self.stage = stage
        self.stderr_tail = stderr_tail
        self.hint = hint

    def __str__(self) -> str:
        base = f"[{self.stage}] {super().__str__()}"
        if self.hint:
            base += f" (hint: {self.hint})"
        return base


def get_available_hardware_encoders() -> set[str]:
    """
    Brain-side encoder detection.
    Since this runs on the Brain, we cannot detect Brawn capabilities.
    Returns empty set to force safe defaults (libx264).
    The Brawn (Muscle) can override this in the Plan if needed.
    """
    return set()


def build_ffmpeg_command(plan: RenderPlan, *, stage: str = "ffmpeg", hint: str | None = None) -> List[str]:
    """
    Extracts the command from the plan.
    """
    if not plan.steps:
        raise FFmpegError("render plan has no steps", stage=stage, hint=hint)
    step = plan.steps[0]
    if not step.ffmpeg_args:
        raise FFmpegError("ffmpeg args missing", stage=stage, hint=hint)
    return step.ffmpeg_args
