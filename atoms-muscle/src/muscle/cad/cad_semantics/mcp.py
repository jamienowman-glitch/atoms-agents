from mcp.server.fastmcp import FastMCP
from .service import SemanticCache

# Initialize FastMCP
mcp = FastMCP("muscle-cad-cad_semantics")

# Initialize Service
service = SemanticCache()

@mcp.tool()
def run_cad_semantics(input_path: str, **kwargs) -> dict:
    """
    Executes the SemanticCache logic.
    """
    return service.run(input_path, **kwargs)

if __name__ == "__main__":
    mcp.run()
