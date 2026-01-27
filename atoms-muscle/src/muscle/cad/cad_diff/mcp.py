from mcp.server.fastmcp import FastMCP
from .service import DiffService

# Initialize FastMCP
mcp = FastMCP("muscle-cad-cad_diff")

# Initialize Service
service = DiffService()

@mcp.tool()
def run_cad_diff(input_path: str, **kwargs) -> dict:
    """
    Executes the DiffService logic.
    """
    return service.run(input_path, **kwargs)

if __name__ == "__main__":
    mcp.run()
