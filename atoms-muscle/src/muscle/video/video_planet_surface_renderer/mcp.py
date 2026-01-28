from mcp.server.fastmcp import FastMCP
from .service import PlanetSurfaceRendererService

# Initialize FastMCP
mcp = FastMCP("muscle-video-video_planet_surface_renderer")

# Initialize Service
service = PlanetSurfaceRendererService()

@mcp.tool()
def run_video_planet_surface_renderer(input_path: str, **kwargs) -> dict:
    """
    Executes the PlanetSurfaceRendererService logic.
    """
    return service.run(input_path, **kwargs)

if __name__ == "__main__":
    mcp.run()
