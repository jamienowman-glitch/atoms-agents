from mcp.server import Server
from mcp.types import Tool, TextContent, ImageContent, EmbeddedResource
from .tools import read, write, git
from .config import ConfigLoader

# Initialize MCP Server
mcp_server = Server("repo-connector")

@mcp_server.list_tools()
async def list_tools() -> list[Tool]:
    """List available tools."""
    tools = [
        Tool(
            name="repo_list_workspaces",
            description="List available workspaces and their root paths.",
            inputSchema={"type": "object", "properties": {}},
        ),
        Tool(
            name="repo_set_active_workspace",
            description="Set the active workspace for the session.",
            inputSchema={
                "type": "object",
                "properties": {"workspace_id": {"type": "string"}},
                "required": ["workspace_id"],
            },
        ),
        Tool(
            name="repo_get_active_workspace",
            description="Get the currently active workspace ID.",
            inputSchema={"type": "object", "properties": {}},
        ),
        Tool(
            name="repo_list_tree",
            description="List files and directories in a path.",
            inputSchema={
                "type": "object",
                "properties": {
                    "workspace_id": {"type": "string"},
                    "path": {"type": "string", "default": "."},
                    "max_depth": {"type": "integer", "default": 1}
                },
            },
        ),
        Tool(
            name="repo_read_file",
            description="Read the full content of a file.",
            inputSchema={
                "type": "object",
                "properties": {
                    "workspace_id": {"type": "string"},
                    "path": {"type": "string"}
                },
                "required": ["path"],
            },
        ),
        Tool(
            name="repo_search",
            description="Search for text patterns using ripgrep.",
            inputSchema={
                "type": "object",
                "properties": {
                    "query": {"type": "string"},
                    "workspace_id": {"type": "string"},
                    "path_glob": {"type": "string"},
                    "limit": {"type": "integer", "default": 50},
                    "regex": {"type": "boolean", "default": False},
                    "case_sensitive": {"type": "boolean", "default": False}
                },
                "required": ["query"],
            },
        ),
        Tool(
            name="repo_fetch",
            description="Fetch a specific search result or file context by stable ID.",
            inputSchema={
                "type": "object",
                "properties": {"id": {"type": "string"}},
                "required": ["id"],
            },
        ),
    ]
    
    # Add write tools if configuration allows?
    # Actually, we should always list them, but they might error if disabled.
    # Or cleaner: only list if enabled.
    # But user asked to "gate behind config flag ENABLE_WRITES=false by default"
    # Usually this means the functionality is gated, listing them is fine so user knows they exist but are disabled.
    # But to be clean, let's include them.
    
    tools.extend([
        Tool(
            name="repo_apply_patch",
            description="Apply a unified diff patch to a file.",
            inputSchema={
                "type": "object",
                "properties": {
                    "workspace_id": {"type": "string"},
                    "path": {"type": "string"},
                    "unified_diff": {"type": "string"},
                    "dry_run": {"type": "boolean", "default": True}
                },
                "required": ["path", "unified_diff"],
            },
        ),
        Tool(
            name="repo_write_file",
            description="Write content to a file.",
            inputSchema={
                "type": "object",
                "properties": {
                    "workspace_id": {"type": "string"},
                    "path": {"type": "string"},
                    "content": {"type": "string"},
                    "dry_run": {"type": "boolean", "default": True}
                },
                "required": ["path", "content"],
            },
        ),
        Tool(
            name="git_status",
            description="Get git status of the workspace.",
            inputSchema={
                "type": "object",
                "properties": {"workspace_id": {"type": "string"}},
            },
        ),
        Tool(
            name="git_create_branch",
            description="Create or switch to a branch.",
            inputSchema={
                "type": "object",
                "properties": {
                    "workspace_id": {"type": "string"},
                    "name": {"type": "string"}
                },
                "required": ["name"],
            },
        ),
        Tool(
            name="git_commit",
            description="Commit changes to the current branch.",
            inputSchema={
                "type": "object",
                "properties": {
                    "workspace_id": {"type": "string"},
                    "message": {"type": "string"},
                    "paths": {"type": "array", "items": {"type": "string"}}
                },
                "required": ["message", "paths"],
            },
        ),
    ])
    
    return tools

@mcp_server.call_tool()
async def call_tool(name: str, arguments: dict) -> list[TextContent | ImageContent | EmbeddedResource]:
    """Execute a tool call."""
    try:
        if name == "repo_list_workspaces":
            result = await read.list_workspaces()
            return [TextContent(type="text", text=str(result))]
            
        elif name == "repo_set_active_workspace":
            result = await read.set_active_workspace(arguments.get("workspace_id"))
            return [TextContent(type="text", text=str(result))]
            
        elif name == "repo_get_active_workspace":
            result = await read.get_active_workspace()
            return [TextContent(type="text", text=str(result))]
            
        elif name == "repo_list_tree":
            result = await read.list_tree(
                workspace_id=arguments.get("workspace_id"),
                path=arguments.get("path", "."),
                max_depth=arguments.get("max_depth", 1)
            )
            return [TextContent(type="text", text=str(result))]
            
        elif name == "repo_read_file":
            result = await read.read_file(
                workspace_id=arguments.get("workspace_id"),
                path=arguments.get("path")
            )
            return [TextContent(type="text", text=result)]
            
        elif name == "repo_search":
            result = await read.search(
                query=arguments.get("query"),
                workspace_id=arguments.get("workspace_id"),
                path_glob=arguments.get("path_glob"),
                limit=arguments.get("limit", 50),
                regex=arguments.get("regex", False),
                case_sensitive=arguments.get("case_sensitive", False)
            )
            return [TextContent(type="text", text=str(result))]
            
        elif name == "repo_fetch":
            result = await read.fetch(arguments.get("id"))
            return [TextContent(type="text", text=str(result))]

        # Write Tools
        elif name == "repo_apply_patch":
            result = await write.apply_patch(
                workspace_id=arguments.get("workspace_id"),
                path=arguments.get("path"),
                patch_content=arguments.get("unified_diff"),
                dry_run=arguments.get("dry_run", True)
            )
            return [TextContent(type="text", text=str(result))]

        elif name == "repo_write_file":
            result = await write.write_file(
                workspace_id=arguments.get("workspace_id"),
                path=arguments.get("path"),
                content=arguments.get("content"),
                dry_run=arguments.get("dry_run", True)
            )
            return [TextContent(type="text", text=str(result))]

        elif name == "git_status":
            result = await git.status(arguments.get("workspace_id"))
            return [TextContent(type="text", text=result)]

        elif name == "git_create_branch":
            result = await git.create_branch(
                workspace_id=arguments.get("workspace_id"),
                name=arguments.get("name")
            )
            return [TextContent(type="text", text=result)]

        elif name == "git_commit":
            result = await git.commit(
                workspace_id=arguments.get("workspace_id"),
                message=arguments.get("message"),
                paths=arguments.get("paths", [])
            )
            return [TextContent(type="text", text=result)]
            
        else:
            raise ValueError(f"Unknown tool: {name}")

    except Exception as e:
        return [TextContent(type="text", text=f"Error: {str(e)}")]
