from mcp.server.fastmcp import FastMCP
from .service import PlanetPreviewService

# Initialize FastMCP
mcp = FastMCP("muscle-video-video_planet_preview")

# Initialize Service
service = PlanetPreviewService()

@mcp.tool()
def run_video_planet_preview(input_path: str, **kwargs) -> dict:
    """
    Executes the PlanetPreviewService logic.
    """
    return service.run(input_path, **kwargs)

if __name__ == "__main__":
    mcp.run()
