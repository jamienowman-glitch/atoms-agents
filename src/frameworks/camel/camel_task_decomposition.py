"""CAMEL Task Decomposition mode."""
from atoms_agents.src.frameworks.camel.camel_base import CAMELBaseFramework


class CAMELTaskDecompositionFramework(CAMELBaseFramework):
    MODE_ID = "task_decomposition"
    NAME = "CAMEL Task Decomposition"
    DESCRIPTION = "Decompose tasks into subtasks."
