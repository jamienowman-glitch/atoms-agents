"""
Forwarding wrapper for BoQQuantitiesService.
Implementation moved to atoms-core.
"""
from atoms_core.src.construction.boq_quantities.service import BoQQuantitiesService, get_boq_service

class ServiceWrapper:
    def __init__(self):
        self.core_service = BoQQuantitiesService()

    def run(self, input_path: str, **kwargs) -> dict:
        """
        Wrapper entry point for MCP.
        TODO: Implement loading of SemanticModel from input_path and calling core_service.quantify.
        """
        return {"error": "Not implemented in migration wrapper", "input": input_path}

# Alias for standard MCP wrapper
Service = ServiceWrapper
