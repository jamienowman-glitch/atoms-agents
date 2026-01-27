from mcp.server.fastmcp import FastMCP
from .service import MotifService

# Initialize FastMCP
mcp = FastMCP("muscle-video-video_motifs")

# Initialize Service
service = MotifService()

@mcp.tool()
def run_video_motifs(input_path: str, **kwargs) -> dict:
    """
    Executes the MotifService logic.
    """
    return service.run(input_path, **kwargs)

if __name__ == "__main__":
    mcp.run()
