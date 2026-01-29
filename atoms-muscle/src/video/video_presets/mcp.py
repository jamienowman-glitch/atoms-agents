from mcp.server.fastmcp import FastMCP
from .service import VideoTemplate

# Initialize FastMCP
mcp = FastMCP("muscle-video-video_presets")

# Initialize Service
service = VideoTemplate()

@mcp.tool()
def run_video_presets(input_path: str, **kwargs) -> dict:
    """
    Executes the VideoTemplate logic.
    """
    return service.run(input_path, **kwargs)

if __name__ == "__main__":
    mcp.run()
