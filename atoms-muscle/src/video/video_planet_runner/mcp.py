from mcp.server.fastmcp import FastMCP
from .service import PlanetRunnerService

# Initialize FastMCP
mcp = FastMCP("muscle-video-video_planet_runner")

# Initialize Service
service = PlanetRunnerService()

@mcp.tool()
def run_video_planet_runner(input_path: str, **kwargs) -> dict:
    """
    Executes the PlanetRunnerService logic.
    """
    return service.run(input_path, **kwargs)

if __name__ == "__main__":
    mcp.run()
