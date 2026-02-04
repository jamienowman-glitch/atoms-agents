"""CAMEL Role Play mode."""
from atoms_agents.src.frameworks.camel.camel_base import CAMELBaseFramework


class CAMELRolePlayFramework(CAMELBaseFramework):
    MODE_ID = "role_play"
    NAME = "CAMEL Role Play"
    DESCRIPTION = "Role-playing agents with task specification."
