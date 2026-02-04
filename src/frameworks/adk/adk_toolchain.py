"""ADK Toolchain mode."""
from atoms_agents.src.frameworks.adk.adk_base import ADKBaseFramework


class ADKToolchainFramework(ADKBaseFramework):
    MODE_ID = "toolchain"
    NAME = "ADK Toolchain"
    DESCRIPTION = "Chained tool execution."
