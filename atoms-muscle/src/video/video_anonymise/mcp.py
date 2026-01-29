from mcp.server.fastmcp import FastMCP
from .service import VideoAnonymiseService

# Initialize FastMCP
mcp = FastMCP("muscle-video-video_anonymise")

# Initialize Service
service = VideoAnonymiseService()

@mcp.tool()
def run_video_anonymise(input_path: str, **kwargs) -> dict:
    """
    Executes the VideoAnonymiseService logic.
    """
    return service.run(input_path, **kwargs)

if __name__ == "__main__":
    mcp.run()
