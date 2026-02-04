"""NeMo Tool Use mode."""
from atoms_agents.src.frameworks.nemo.nemo_base import NeMoBaseFramework


class NeMoToolUseFramework(NeMoBaseFramework):
    MODE_ID = "tool_use"
    NAME = "NeMo Tool Use"
    DESCRIPTION = "Tool calling with NeMo agents."
