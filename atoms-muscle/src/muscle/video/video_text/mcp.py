from mcp.server.fastmcp import FastMCP
from .service import VideoTextService

# Initialize FastMCP
mcp = FastMCP("muscle-video-video_text")

# Initialize Service
service = VideoTextService()

@mcp.tool()
def run_video_text(input_path: str, **kwargs) -> dict:
    """
    Executes the VideoTextService logic.
    """
    return service.run(input_path, **kwargs)

if __name__ == "__main__":
    mcp.run()
