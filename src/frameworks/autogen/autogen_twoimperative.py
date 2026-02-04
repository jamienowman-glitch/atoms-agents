"""AutoGen Two Agent mode."""
from atoms_agents.src.frameworks.autogen.autogen_base import AutoGenBaseFramework


class AutoGenTwoimperativeFramework(AutoGenBaseFramework):
    MODE_ID = "twoimperative"
    NAME = "AutoGen Two Agent"
    DESCRIPTION = "Two-agent imperative loop."
