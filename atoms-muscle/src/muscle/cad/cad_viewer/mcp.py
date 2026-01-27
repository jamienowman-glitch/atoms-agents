from mcp.server.fastmcp import FastMCP
from .service import Service

# Initialize FastMCP
mcp = FastMCP("muscle-cad-cad_viewer")

# Initialize Service
service = Service()

@mcp.tool()
def run_cad_viewer(input_path: str, **kwargs) -> dict:
    """
    Executes the Service logic.
    """
    return service.run(input_path, **kwargs)

if __name__ == "__main__":
    mcp.run()
