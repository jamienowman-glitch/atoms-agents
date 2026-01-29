from __future__ import annotations

from typing import List, Optional, Protocol, Union

from .timeline_models import (
    Clip,
    FilterStack,
    ParameterAutomation,
    Sequence,
    Track,
    Transition,
    VideoProject,
)


class TimelineServiceProtocol(Protocol):
    def get_project(self, project_id: str) -> Optional[VideoProject]: ...

    def list_sequences_for_project(self, project_id: str) -> List[Sequence]: ...

    def list_tracks_for_sequence(self, sequence_id: str) -> List[Track]: ...

    def list_clips_for_track(self, track_id: str) -> List[Clip]: ...

    def list_automation(self, target_type: str, target_id: str) -> List[ParameterAutomation]: ...

    def list_transitions_for_sequence(self, sequence_id: str) -> List[Transition]: ...

    def get_filter_stack_for_target(self, target_type: str, target_id: str) -> Optional[FilterStack]: ...


_service: Optional[TimelineServiceProtocol] = None


def get_timeline_service() -> TimelineServiceProtocol:
    if _service is None:
        raise RuntimeError("TimelineService not initialized. Call set_timeline_service first.")
    return _service


def set_timeline_service(service: TimelineServiceProtocol) -> None:
    global _service
    _service = service
