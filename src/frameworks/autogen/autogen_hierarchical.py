"""AutoGen Hierarchical mode."""
from atoms_agents.src.frameworks.autogen.autogen_base import AutoGenBaseFramework


class AutoGenHierarchicalFramework(AutoGenBaseFramework):
    MODE_ID = "hierarchical"
    NAME = "AutoGen Hierarchical"
    DESCRIPTION = "Hierarchical planner/worker orchestration."
