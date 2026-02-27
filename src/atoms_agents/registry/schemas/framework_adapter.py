from dataclasses import dataclass


@dataclass
class FrameworkAdapterCard:
    framework_id: str  # e.g. "autogen", "crewai"
    adapter_import_path: str  # e.g. "atoms_agents.runtime.adapters.autogen_adapter"

