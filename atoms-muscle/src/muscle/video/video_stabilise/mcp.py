from mcp.server.fastmcp import FastMCP
from .service import VideoStabiliseService

# Initialize FastMCP
mcp = FastMCP("muscle-video-video_stabilise")

# Initialize Service
service = VideoStabiliseService()

@mcp.tool()
def run_video_stabilise(input_path: str, **kwargs) -> dict:
    """
    Executes the VideoStabiliseService logic.
    """
    return service.run(input_path, **kwargs)

if __name__ == "__main__":
    mcp.run()
