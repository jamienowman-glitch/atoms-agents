"""ADK Router mode."""
from atoms_agents.src.frameworks.adk.adk_base import ADKBaseFramework


class ADKRouterFramework(ADKBaseFramework):
    MODE_ID = "router"
    NAME = "ADK Router"
    DESCRIPTION = "Routing between tools/agents."
