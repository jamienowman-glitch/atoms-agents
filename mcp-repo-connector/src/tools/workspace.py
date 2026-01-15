from typing import List, Dict, Any, Optional
from ..discovery import Discovery
from ..audit import AuditLogger
from ..config import ConfigLoader
from ..state import ServerState

async def list() -> List[Dict[str, Any]]:
    workspaces = Discovery.scan()
    state = ServerState.get()
    
    # Return all, but maybe mark which are allowed in current scope?
    # User said "I can choose... workspace".
    # Multi-select UI needs to see all to select them.
    # So list() returns everything available for selection.
    
    return [
        {
            "workspace_id": ws.id,
            "display_name": ws.display_name,
            "root_path": ws.root_path,
            "kind": ws.kind,
            "in_scope": state.is_scope_allowed(ws.id)
        }
        for ws in workspaces
    ]

async def refresh() -> Dict[str, Any]:
    workspaces = Discovery.scan()
    AuditLogger.log("workspace.refresh", {})
    return {
        "status": "refreshed",
        "count": len(workspaces),
        "workspaces": [ws.id for ws in workspaces]
    }

async def set_active(workspace_id: str) -> Dict[str, Any]:
    # This tool essentially attempts to "Search" or "Focus" on a workspace.
    # But in the new model, "Active Scope" is a Set managed via UI controls (state.set_scopes).
    # If the LLM calls `set_active`, does it change the session scope?
    # "Add a 'Lock scope' toggle per session so it cannot roam (even if a tool call tries)."
    # So `set_active` IS the tool call trying to roam.
    
    state = ServerState.get()
    
    if state.scope_locked:
        # Check if requested workspace is in current scope
        if not state.is_scope_allowed(workspace_id):
            raise PermissionError(f"Scope is locked. Cannot switch to {workspace_id}.")
    
    # If not locked, does `set_active` ADD to scope or REPLACE scope?
    # "I can choose a repo... or the full dev root".
    # Usually LLM thinks of "active workspace" as "cwd".
    # Let's say `set_active` changes the `active_scope` to ONLY this workspace,
    # UNLESS locked.
    
    # Verify existence
    Discovery.get_workspace(workspace_id)
    
    if not state.scope_locked:
        state.set_scopes([workspace_id])
    
    AuditLogger.log("workspace.set_active", {"workspace_id": workspace_id})
    return {
        "ok": True, 
        "active_workspace_id": workspace_id,
        "note": "Scope updated" if not state.scope_locked else "Focus updated within locked scope"
    }

async def get_active() -> Dict[str, Any]:
    state = ServerState.get()
    # If multiple scopes, what is "active"?
    # Maybe just return the list?
    return {
        "active_scopes": list(state.active_scopes),
        "scope_locked": state.scope_locked
    }
