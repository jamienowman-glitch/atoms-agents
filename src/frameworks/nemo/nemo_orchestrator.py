"""NeMo Orchestrator mode."""
from atoms_agents.src.frameworks.nemo.nemo_base import NeMoBaseFramework


class NeMoOrchestratorFramework(NeMoBaseFramework):
    MODE_ID = "orchestrator"
    NAME = "NeMo Orchestrator"
    DESCRIPTION = "NeMo orchestration mode."
