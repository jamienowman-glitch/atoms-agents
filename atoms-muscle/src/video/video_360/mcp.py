from mcp.server.fastmcp import FastMCP
from .service import InMemoryPathRepository

# Initialize FastMCP
mcp = FastMCP("muscle-video-video_360")

# Initialize Service
service = InMemoryPathRepository()

@mcp.tool()
def run_video_360(input_path: str, **kwargs) -> dict:
    """
    Executes the InMemoryPathRepository logic.
    """
    return service.run(input_path, **kwargs)

if __name__ == "__main__":
    mcp.run()
