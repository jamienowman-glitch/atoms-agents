"""CrewAI Hybrid mode."""
from atoms_agents.frameworks.crewai.crewai_base import CrewAIBaseFramework


class CrewAIHybridFramework(CrewAIBaseFramework):
    MODE_ID = "hybrid"
    NAME = "CrewAI Hybrid"
    DESCRIPTION = "Mixed sequential + parallel execution."
