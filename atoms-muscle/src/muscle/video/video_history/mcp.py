from mcp.server.fastmcp import FastMCP
from .service import HistoryService

# Initialize FastMCP
mcp = FastMCP("muscle-video-video_history")

# Initialize Service
service = HistoryService()

@mcp.tool()
def run_video_history(input_path: str, **kwargs) -> dict:
    """
    Executes the HistoryService logic.
    """
    return service.run(input_path, **kwargs)

if __name__ == "__main__":
    mcp.run()
