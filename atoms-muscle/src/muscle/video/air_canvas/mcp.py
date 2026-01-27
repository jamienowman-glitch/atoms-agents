from mcp.server.fastmcp import FastMCP
from .service import AirCanvas

# Initialize FastMCP
mcp = FastMCP("muscle-video-air_canvas")

# Initialize Service
service = AirCanvas()

@mcp.tool()
def run_air_canvas(input_path: str, **kwargs) -> dict:
    """
    Executes the AirCanvas logic.
    """
    return service.run(input_path, **kwargs)

if __name__ == "__main__":
    mcp.run()
