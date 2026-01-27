from mcp.server.fastmcp import FastMCP
from .service import TypographyService

# Initialize FastMCP
mcp = FastMCP("muscle-text-typography_core")

# Initialize Service
service = TypographyService()

@mcp.tool()
def run_typography_core(input_path: str, **kwargs) -> dict:
    """
    Executes the TypographyService logic.
    """
    return service.run(input_path, **kwargs)

if __name__ == "__main__":
    mcp.run()
