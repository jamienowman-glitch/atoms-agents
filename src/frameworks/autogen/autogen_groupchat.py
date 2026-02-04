"""AutoGen Group Chat mode."""
from atoms_agents.src.frameworks.autogen.autogen_base import AutoGenBaseFramework


class AutoGenGroupchatFramework(AutoGenBaseFramework):
    MODE_ID = "groupchat"
    NAME = "AutoGen Group Chat"
    DESCRIPTION = "Multi-agent group chat coordination."
