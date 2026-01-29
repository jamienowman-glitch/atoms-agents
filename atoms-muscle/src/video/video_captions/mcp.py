from mcp.server.fastmcp import FastMCP
from .service import VideoCaptionsService

# Initialize FastMCP
mcp = FastMCP("muscle-video-video_captions")

# Initialize Service
service = VideoCaptionsService()

@mcp.tool()
def run_video_captions(input_path: str, **kwargs) -> dict:
    """
    Executes the VideoCaptionsService logic.
    """
    return service.run(input_path, **kwargs)

if __name__ == "__main__":
    mcp.run()
