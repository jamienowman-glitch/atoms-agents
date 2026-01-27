from mcp.server.fastmcp import FastMCP
from .service import MaskBackend

# Initialize FastMCP
mcp = FastMCP("muscle-video-video_mask")

# Initialize Service
service = MaskBackend()

@mcp.tool()
def run_video_mask(input_path: str, **kwargs) -> dict:
    """
    Executes the MaskBackend logic.
    """
    return service.run(input_path, **kwargs)

if __name__ == "__main__":
    mcp.run()
