from mcp.server.fastmcp import FastMCP
from .service import BoQCache

# Initialize FastMCP
mcp = FastMCP("muscle-construction-boq_quantities")

# Initialize Service
service = BoQCache()

@mcp.tool()
def run_boq_quantities(input_path: str, **kwargs) -> dict:
    """
    Executes the BoQCache logic.
    """
    return service.run(input_path, **kwargs)

if __name__ == "__main__":
    mcp.run()
