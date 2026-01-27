from mcp.server.fastmcp import FastMCP
from .service import CadIngestCache

# Initialize FastMCP
mcp = FastMCP("muscle-cad-cad_ingest")

# Initialize Service
service = CadIngestCache()

@mcp.tool()
def run_cad_ingest(input_path: str, **kwargs) -> dict:
    """
    Executes the CadIngestCache logic.
    """
    return service.run(input_path, **kwargs)

if __name__ == "__main__":
    mcp.run()
