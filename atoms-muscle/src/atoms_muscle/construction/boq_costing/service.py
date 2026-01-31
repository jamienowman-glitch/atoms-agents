"""
Forwarding wrapper for BoQCostingService.
Implementation moved to atoms-core.
"""
from atoms_core.src.construction.boq_costing.service import BoQCostingService, get_costing_service

class ServiceWrapper:
    def __init__(self):
        self.core_service = BoQCostingService()

    def run(self, input_path: str, **kwargs) -> dict:
        """
        Wrapper entry point for MCP.
        TODO: Implement loading of BoQModel from input_path and calling core_service.estimate_cost.
        """
        return {"error": "Not implemented in migration wrapper", "input": input_path}

# Alias for standard MCP wrapper
Service = ServiceWrapper
