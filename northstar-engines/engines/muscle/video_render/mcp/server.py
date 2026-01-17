from fastapi import FastAPI
from engines.muscle.video_render.mcp.tools import render_tool, RenderInput

app = FastAPI(title="Video Render MCP Server")

@app.post("/render")
async def render_endpoint(args: RenderInput):
    # This is just a stub for direct calls if needed
    # In real MCP, this might be handled via a unified protocol
    return {"message": "Use MCP protocol"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
