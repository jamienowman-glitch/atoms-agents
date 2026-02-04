"""ChatDev Review mode."""
from atoms_agents.src.frameworks.chatdev.chatdev_base import ChatDevBaseFramework


class ChatDevReviewFramework(ChatDevBaseFramework):
    MODE_ID = "review"
    NAME = "ChatDev Review"
    DESCRIPTION = "QA/review mode."
