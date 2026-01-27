from mcp.server.fastmcp import FastMCP
from .service import TimelineAnalyzerService

# Initialize FastMCP
mcp = FastMCP("muscle-timeline-timeline_analyzer")

# Initialize Service
service = TimelineAnalyzerService()

@mcp.tool()
def run_timeline_analyzer(input_path: str, **kwargs) -> dict:
    """
    Executes the TimelineAnalyzerService logic.
    """
    return service.run(input_path, **kwargs)

if __name__ == "__main__":
    mcp.run()
