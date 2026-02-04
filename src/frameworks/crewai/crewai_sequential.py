"""CrewAI Sequential mode."""
from atoms_agents.src.frameworks.crewai.crewai_base import CrewAIBaseFramework


class CrewAISequentialFramework(CrewAIBaseFramework):
    MODE_ID = "sequential"
    NAME = "CrewAI Sequential"
    DESCRIPTION = "Sequential task execution."
