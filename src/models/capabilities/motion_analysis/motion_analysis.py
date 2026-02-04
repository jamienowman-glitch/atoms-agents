"""Motion Analysis capability."""
from atoms_agents.src.models.capabilities.base_capability import BaseCapability


class MotionAnalysisCapability(BaseCapability):
    CAPABILITY_ID = "motion_analysis"
    NAME = "Motion Analysis"
    DESCRIPTION = "Track movement in video."
    SUPPORTED_BACKENDS = ['openai', 'huggingface']
