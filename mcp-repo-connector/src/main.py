from fastapi import FastAPI, Request, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, JSONResponse
import uvicorn
import os
import json
import time
from typing import List, Optional
from pydantic import BaseModel

from .config import ConfigLoader
from .tools import read, write, workspace
from .state import ServerState
from .tunnel import TunnelManager
from .security import Security

# Load config
config = ConfigLoader.load()

app = FastAPI()

@app.middleware("http")
async def log_requests(request: Request, call_next):
    import sys
    sys.stderr.write(f"Request: {request.method} {request.url}\n")
    sys.stderr.write(f"Headers: {request.headers}\n")
    sys.stderr.flush()
    response = await call_next(request)
    sys.stderr.write(f"Response: {response.status_code}\n")
    return response

# Static files
static_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "static")
if os.path.exists(static_dir):
    app.mount("/static", StaticFiles(directory=static_dir), name="static")

@app.get("/ui", response_class=HTMLResponse)
async def read_ui():
    index_path = os.path.join(static_dir, "index.html")
    if os.path.exists(index_path):
        with open(index_path, 'r') as f:
            return f.read()
    return "UI not installed"

@app.get("/")
async def root():
    return {"status": "online", "mcp_endpoint": "/mcp/sse", "ui": "/ui"}

# --- REST APIs for UI Control ---

class ScopeUpdate(BaseModel):
    scopes: List[str]

class ModeUpdate(BaseModel):
    enable_writes: bool
    duration_minutes: Optional[int] = 60

class TunnelRequest(BaseModel):
    action: str # start/stop
    provider: str = "cloudflared"

@app.get("/api/state")
async def get_state():
    state = ServerState.get()
    return {
        "write_enabled": state.write_enabled,
        "write_expires_in": max(0, int(state.write_expires_at - time.time())) if state.write_enabled else 0,
        "active_scopes": list(state.active_scopes),
        "scope_locked": state.scope_locked,
        "tunnel_url": state.tunnel_url,
        "tunnel_status": state.tunnel_status
    }

@app.post("/api/control/scope")
async def set_scope(body: ScopeUpdate):
    state = ServerState.get()
    try:
        if state.scope_locked:
            raise HTTPException(status_code=403, detail="Scope is locked")
        state.set_scopes(body.scopes)
        return {"status": "ok", "scopes": body.scopes}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/control/mode")
async def set_mode(body: ModeUpdate):
    state = ServerState.get()
    if body.enable_writes:
        state.enable_writes(body.duration_minutes)
    else:
        state.disable_writes()
    return {"status": "ok", "write_enabled": state.write_enabled}

@app.post("/api/control/lock")
async def toggle_lock(body: dict):
    state = ServerState.get()
    if body.get("locked"):
        state.lock_scope()
    else:
        state.unlock_scope()
    return {"status": "ok", "locked": state.scope_locked}

@app.post("/api/tunnel")
async def control_tunnel(body: TunnelRequest):
    if body.action == "start":
        TunnelManager.start(body.provider, config.port)
    elif body.action == "stop":
        TunnelManager.stop()
    return {"status": "ok"}

@app.post("/api/selftest")
async def run_selftest():
    results = {}
    
    # 1. Sandbox Test
    try:
        # accessing forbidden files
        Security.is_path_safe("/etc/passwd") 
        if Security.is_path_safe("/etc/passwd") == False:
            results["sandbox"] = "PASS"
        else:
            results["sandbox"] = "FAIL: /etc/passwd allowed"
    except Exception as e:
        results["sandbox"] = f"ERROR: {e}"
        
    # 2. Denylist Test
    try:
        if Security.is_path_safe("/Users/jaynowman/dev/.env") == False:
             results["denylist"] = "PASS"
        else:
             results["denylist"] = "FAIL: .env allowed"
    except Exception as e:
        results["denylist"] = f"ERROR: {e}"

    # 3. Discovery Test
    try:
        ws = await workspace.list()
        if len(ws) > 0 and any(w["workspace_id"] == "dev-root" for w in ws):
            results["discovery"] = f"PASS: Found {len(ws)} workspaces"
        else:
            results["discovery"] = "FAIL: No workspaces or missing dev-root"
    except Exception as e:
        results["discovery"] = f"ERROR: {e}"

    return {"results": results}


# --- MCP Protocol ---

@app.api_route("/mcp/sse", methods=["GET", "HEAD"])
async def mcp_sse(request: Request):
    if request.method == "HEAD":
        return JSONResponse(content={"status": "ok"}, status_code=200)

    from sse_starlette.sse import EventSourceResponse
    import asyncio
    async def event_generator():
        yield json.dumps({"event": "endpoint", "data": "/mcp/messages"})
        while True:
            await asyncio.sleep(60)
            
    return EventSourceResponse(event_generator())

async def handle_tool_call(name, args):
    # Reuse updated tool logic
    if name == "workspace_list": return await workspace.list()
    elif name == "workspace_refresh": return await workspace.refresh()
    elif name == "workspace_set_active": return await workspace.set_active(args.get("workspace_id"))
    elif name == "workspace_get_active": return await workspace.get_active()
    elif name == "repo_list_tree": return await read.list_tree(args.get("workspace_id"), args.get("path", "."), args.get("max_depth", 1))
    elif name == "repo_read_file": return await read.read_file(args.get("workspace_id"), args.get("path"))
    elif name == "repo_search": return await read.search(args.get("query"), args.get("workspace_id"), args.get("path_glob"), args.get("limit", 50), args.get("regex", False), args.get("case_sensitive", False))
    elif name == "repo_fetch": return await read.fetch(args.get("id"))
    elif name == "repo_apply_patch": return await write.apply_patch(args.get("workspace_id"), args.get("path"), args.get("unified_diff"), args.get("dry_run", True))
    elif name == "repo_write_file": return await write.write_file(args.get("workspace_id"), args.get("path"), args.get("content"), args.get("dry_run", True))
    else: raise ValueError(f"Unknown tool: {name}")

@app.post("/mcp/messages")
async def handle_mcp_message(request: Request):
    data = await request.json()
    method = data.get("method")
    msg_id = data.get("id")
    
    if method == "tools/list":
        # ... (Same tool schema list, maybe dynamic based on state? 
        # But schemas usually static. Tool calls fail if perm missing.)
        # For brevity, reusing the previous schema defined in last main.py
        # It's huge, so I will reconstruct minimal needed.
        
        # Actually, let's keep it complete.
        result = {
            "tools": [
                {"name": "workspace.list", "description": "List discoverable workspaces", "inputSchema": {"type": "object", "properties": {}}},
                {"name": "workspace.refresh", "description": "Refresh workspaces", "inputSchema": {"type": "object", "properties": {}}},
                {"name": "workspace.set_active", "description": "Focus workspace", "inputSchema": {"type": "object", "properties": {"workspace_id": {"type": "string"}}, "required": ["workspace_id"]}},
                {"name": "repo.list_tree", "description": "List files", "inputSchema": {"type": "object", "properties": {"workspace_id": {"type": "string"}, "path": {"type": "string"}}}},
                {"name": "repo.read_file", "description": "Read file", "inputSchema": {"type": "object", "properties": {"workspace_id": {"type": "string"}, "path": {"type": "string"}}, "required": ["path"]}},
                {"name": "repo.search", "description": "Search", "inputSchema": {"type": "object", "properties": {"query": {"type": "string"}, "workspace_id": {"type": "string"}, "path_glob": {"type": "string"}}, "required": ["query"]}},
                {"name": "repo.fetch", "description": "Fetch hit", "inputSchema": {"type": "object", "properties": {"id": {"type": "string"}}, "required": ["id"]}},
                {"name": "repo.write_file", "description": "Write file", "inputSchema": {"type": "object", "properties": {"path": {"type": "string"}, "content": {"type": "string"}, "dry_run": {"type": "boolean"}}, "required": ["path", "content"]}},
                {"name": "repo.apply_patch", "description": "Apply patch", "inputSchema": {"type": "object", "properties": {"path": {"type": "string"}, "unified_diff": {"type": "string"}, "dry_run": {"type": "boolean"}}, "required": ["path", "unified_diff"]}},
            ]
        }
        return {"jsonrpc": "2.0", "result": result, "id": msg_id}
        
    elif method == "tools/call":
        params = data.get("params", {})
        name = params.get("name").replace(".", "_")
        try:
            content = await handle_tool_call(name, params.get("arguments", {}))
            content_str = json.dumps(content, default=str) if not isinstance(content, str) else content
            return {"jsonrpc": "2.0", "result": {"content": [{"type": "text", "text": content_str}]}, "id": msg_id}
        except Exception as e:
            return {"jsonrpc": "2.0", "error": {"code": -32000, "message": str(e)}, "id": msg_id}

    return {"jsonrpc": "2.0", "result": {}, "id": msg_id}

if __name__ == "__main__":
    uvicorn.run(app, host=config.host, port=config.port)
