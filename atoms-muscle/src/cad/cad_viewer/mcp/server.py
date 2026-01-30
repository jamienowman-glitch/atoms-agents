from fastapi import FastAPI
from .tools import view_gantt, view_overlay, CadViewInput

app = FastAPI(title="CAD Viewer MCP Server")

@app.post("/gantt")
async def gantt_endpoint(args: CadViewInput):
    return {"message": "Use MCP protocol"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
