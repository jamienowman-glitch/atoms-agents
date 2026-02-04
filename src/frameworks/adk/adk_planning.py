"""ADK Planning mode."""
from atoms_agents.src.frameworks.adk.adk_base import ADKBaseFramework


class ADKPlanningFramework(ADKBaseFramework):
    MODE_ID = "planning"
    NAME = "ADK Planning"
    DESCRIPTION = "Plan/execute separation."
