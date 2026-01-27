from mcp.server.fastmcp import FastMCP
from .service import BoQCostingService

# Initialize FastMCP
mcp = FastMCP("muscle-construction-boq_costing")

# Initialize Service
service = BoQCostingService()

@mcp.tool()
def run_boq_costing(input_path: str, **kwargs) -> dict:
    """
    Executes the BoQCostingService logic.
    """
    # TODO: Adapt input_path to BoQModel or CostRequest
    return service.estimate_cost(input_path, **kwargs)

if __name__ == "__main__":
    mcp.run()
