from mcp.server.fastmcp import FastMCP
from .service import TimelineService

# Initialize FastMCP
mcp = FastMCP("muscle-timeline-timeline_core")

# Initialize Service
service = TimelineService()

@mcp.tool()
def run_timeline_core(input_path: str, **kwargs) -> dict:
    """
    Executes the TimelineService logic.
    """
    return service.run(input_path, **kwargs)

if __name__ == "__main__":
    mcp.run()
