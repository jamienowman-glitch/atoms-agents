"""CAMEL Collaboration mode."""
from atoms_agents.src.frameworks.camel.camel_base import CAMELBaseFramework


class CAMELCollaborationFramework(CAMELBaseFramework):
    MODE_ID = "collaboration"
    NAME = "CAMEL Collaboration"
    DESCRIPTION = "Collaborative multi-agent loop."
