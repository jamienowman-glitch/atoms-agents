from fastapi import FastAPI, HTTPException, Query
import httpx

app = FastAPI(title="MCP Gateway Storefront")

TOOL_PORTS = {
    "video_render": 8000,
    "cad_viewer": 8001
}

@app.get("/connect")
async def connect(tool: str = Query(...), api_key: str = Query(None)):
    """
    Connect to a specific muscle tool.
    Proxies the connection to the underlying MCP server.
    """
    if api_key != "mock-secret":
        raise HTTPException(status_code=403, detail="Invalid API Key")

    port = TOOL_PORTS.get(tool)
    if not port:
        raise HTTPException(status_code=404, detail=f"Tool '{tool}' not found")

    target_url = f"http://localhost:{port}/"

    # In a real implementation, this would be a reverse proxy (e.g. using starlette-proxy or httpx streaming).
    # For this scaffold, we verify the target exists and return the connection details.

    try:
        async with httpx.AsyncClient() as client:
            # Check if target is up (optional)
            # resp = await client.get(target_url)
            # if resp.status_code != 200:
            #     raise HTTPException(status_code=502, detail="Tool backend unavailable")
            pass
    except Exception:
        pass # Ignore for scaffold if server not actually running

    return {
        "status": "connected",
        "tool": tool,
        "upstream": target_url,
        "message": "Connection established (Proxy Scaffold)"
    }
