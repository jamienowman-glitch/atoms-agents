from mcp.server.fastmcp import FastMCP
from .service import TimelineRepository

# Initialize FastMCP
mcp = FastMCP("muscle-video-video_timeline")

# Initialize Service
service = TimelineRepository()

@mcp.tool()
def run_video_timeline(input_path: str, **kwargs) -> dict:
    """
    Executes the TimelineRepository logic.
    """
    return service.run(input_path, **kwargs)

if __name__ == "__main__":
    mcp.run()
