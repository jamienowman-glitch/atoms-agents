from mcp.server.fastmcp import FastMCP
from .service import StubAlignBackend

# Initialize FastMCP
mcp = FastMCP("muscle-video-video_multicam")

# Initialize Service
service = StubAlignBackend()

@mcp.tool()
def run_video_multicam(input_path: str, **kwargs) -> dict:
    """
    Executes the StubAlignBackend logic.
    """
    return service.run(input_path, **kwargs)

if __name__ == "__main__":
    mcp.run()
