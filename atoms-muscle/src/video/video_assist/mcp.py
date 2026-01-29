from mcp.server.fastmcp import FastMCP
from .service import VideoAssistService

# Initialize FastMCP
mcp = FastMCP("muscle-video-video_assist")

# Initialize Service
service = VideoAssistService()

@mcp.tool()
def run_video_assist(input_path: str, **kwargs) -> dict:
    """
    Executes the VideoAssistService logic.
    """
    return service.run(input_path, **kwargs)

if __name__ == "__main__":
    mcp.run()
