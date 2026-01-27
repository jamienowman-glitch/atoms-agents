from mcp.server.fastmcp import FastMCP
from .service import MediaRepository

# Initialize FastMCP
mcp = FastMCP("muscle-media-media_v2")

# Initialize Service
service = MediaRepository()

@mcp.tool()
def run_media_v2(input_path: str, **kwargs) -> dict:
    """
    Executes the MediaRepository logic.
    """
    return service.run(input_path, **kwargs)

if __name__ == "__main__":
    mcp.run()
