from mcp.server.fastmcp import FastMCP
from .service import VisualMetaBackend

# Initialize FastMCP
mcp = FastMCP("muscle-video-video_visual_meta")

# Initialize Service
service = VisualMetaBackend()

@mcp.tool()
def run_video_visual_meta(input_path: str, **kwargs) -> dict:
    """
    Executes the VisualMetaBackend logic.
    """
    return service.run(input_path, **kwargs)

if __name__ == "__main__":
    mcp.run()
