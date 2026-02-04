"""AutoGen Debate mode."""
from atoms_agents.src.frameworks.autogen.autogen_base import AutoGenBaseFramework


class AutoGenDebateFramework(AutoGenBaseFramework):
    MODE_ID = "debate"
    NAME = "AutoGen Debate"
    DESCRIPTION = "Structured debate mode."
