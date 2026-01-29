from __future__ import annotations

from typing import List, Optional, Tuple, Dict, Any

from ..dependencies.media import MediaServiceProtocol
from ..dependencies.timeline_models import Clip, Filter

# Stub for RegionAnalysisSummary since we can't import engines.video_regions
class RegionEntry:
    region: str
    mask_artifact_id: str

class RegionAnalysisSummary:
    entries: List[RegionEntry]

def resolve_region_masks_for_clip(
    media_service: MediaServiceProtocol,
    clip: Clip,
    filters: List[Filter]
) -> Dict[int, str]:
    # STUB: Brain implementation does not support file-based mask resolution yet.
    # To support this, we would need to fetch the summary artifact content.
    return {}
