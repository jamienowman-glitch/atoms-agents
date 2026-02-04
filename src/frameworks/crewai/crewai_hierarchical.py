"""CrewAI Hierarchical mode."""
from atoms_agents.src.frameworks.crewai.crewai_base import CrewAIBaseFramework


class CrewAIHierarchicalFramework(CrewAIBaseFramework):
    MODE_ID = "hierarchical"
    NAME = "CrewAI Hierarchical"
    DESCRIPTION = "Manager/worker hierarchy."
