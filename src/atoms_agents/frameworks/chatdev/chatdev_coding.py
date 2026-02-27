"""ChatDev Coding mode."""
from atoms_agents.frameworks.chatdev.chatdev_base import ChatDevBaseFramework


class ChatDevCodingFramework(ChatDevBaseFramework):
    MODE_ID = "coding"
    NAME = "ChatDev Coding"
    DESCRIPTION = "Execution and implementation."
