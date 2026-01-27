from mcp.server.fastmcp import FastMCP
from .service import PreviewService

# Initialize FastMCP
mcp = FastMCP("muscle-video-video_preview")

# Initialize Service
service = PreviewService()

@mcp.tool()
def run_video_preview(input_path: str, **kwargs) -> dict:
    """
    Executes the PreviewService logic.
    """
    return service.run(input_path, **kwargs)

if __name__ == "__main__":
    mcp.run()
