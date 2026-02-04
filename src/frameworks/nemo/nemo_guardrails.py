"""NeMo Guardrails mode."""
from atoms_agents.src.frameworks.nemo.nemo_base import NeMoBaseFramework


class NeMoGuardrailsFramework(NeMoBaseFramework):
    MODE_ID = "guardrails"
    NAME = "NeMo Guardrails"
    DESCRIPTION = "Safety/guardrail enforcement."
