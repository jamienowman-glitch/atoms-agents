from mcp.server.fastmcp import FastMCP
from .service import VideoRegionsService

# Initialize FastMCP
mcp = FastMCP("muscle-video-video_regions")

# Initialize Service
service = VideoRegionsService()

@mcp.tool()
def run_video_regions(input_path: str, **kwargs) -> dict:
    """
    Executes the VideoRegionsService logic.
    """
    return service.run(input_path, **kwargs)

if __name__ == "__main__":
    mcp.run()
