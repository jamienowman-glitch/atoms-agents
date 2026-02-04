"""ChatDev Planning mode."""
from atoms_agents.src.frameworks.chatdev.chatdev_base import ChatDevBaseFramework


class ChatDevPlanningFramework(ChatDevBaseFramework):
    MODE_ID = "planning"
    NAME = "ChatDev Planning"
    DESCRIPTION = "Planning and spec alignment."
