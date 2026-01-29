from mcp.server.fastmcp import FastMCP
from .service import FocusAutomationService

# Initialize FastMCP
mcp = FastMCP("muscle-video-video_focus_automation")

# Initialize Service
service = FocusAutomationService()

@mcp.tool()
def run_video_focus_automation(input_path: str, **kwargs) -> dict:
    """
    Executes the FocusAutomationService logic.
    """
    return service.run(input_path, **kwargs)

if __name__ == "__main__":
    mcp.run()
