import os
import hashlib
import json
import subprocess
from typing import List, Dict, Optional, Any
from ..config import ConfigLoader
from ..discovery import Discovery
from ..security import Security, SecurityError
from ..audit import AuditLogger
from ..state import ServerState

def _resolve_workspace_id(workspace_id: Optional[str]) -> str:
    state = ServerState.get()
    
    # If explicit workspace_id provided
    if workspace_id:
        if not state.is_scope_allowed(workspace_id):
            raise PermissionError(f"Access to workspace '{workspace_id}' denied by active scope.")
        return workspace_id
        
    # If None, use active scope?
    # If multiple scopes active, which one?
    # "repo.search(query, workspace_id?)"
    # If ambiguous, maybe search across ALL active scopes?
    # For now, let's pick the first one or error if multiple?
    # Or default to 'dev-root' if in scope?
    
    # If 'dev-root' is in scope, use it as default
    if "dev-root" in state.active_scopes:
        return "dev-root"
        
    # Use first one
    if state.active_scopes:
        return list(state.active_scopes)[0]
        
    raise ValueError("No active scope selected.")

async def list_tree(workspace_id: Optional[str] = None, path: str = ".", max_depth: int = 2) -> List[Dict[str, Any]]:
    ws_id = _resolve_workspace_id(workspace_id)
    ws = Discovery.get_workspace(ws_id)
    
    # Validate against workspace root
    abs_path = Security.validate_path(path, ws_id)
    
    results = []
    base_depth = abs_path.rstrip(os.sep).count(os.sep)
    
    for root, dirs, files in os.walk(abs_path):
        curr_depth = root.count(os.sep)
        if curr_depth - base_depth >= max_depth:
            del dirs[:]
            continue
            
        dirs[:] = [d for d in dirs if not d.startswith('.') and not d == '__pycache__']
        
        for name in dirs + files:
            full_path = os.path.join(root, name)
            if not Security.is_path_safe(full_path):
                continue
                
            is_dir = os.path.isdir(full_path)
            rel_path = os.path.relpath(full_path, abs_path)
            size = os.path.getsize(full_path) if not is_dir else 0
            
            results.append({
                "path": rel_path,
                "type": "dir" if is_dir else "file",
                "size_bytes": size
            })
            
    AuditLogger.log("repo.list_tree", {"workspace_id": ws_id, "path": path})
    return results

async def read_file(workspace_id: Optional[str], path: str) -> Dict[str, Any]:
    ws_id = _resolve_workspace_id(workspace_id)
    abs_path = Security.validate_path(path, ws_id)
    
    try:
        with open(abs_path, 'rb') as f:
            content_bytes = f.read()
        
        try:
            content_str = content_bytes.decode('utf-8')
        except UnicodeDecodeError:
            content_str = "[Binary Data]"
            
        sha256 = hashlib.sha256(content_bytes).hexdigest()
        
        AuditLogger.log("repo.read_file", {"workspace_id": ws_id, "path": path})
        return {
            "content": content_str,
            "bytes": len(content_bytes),
            "sha256": sha256
        }
    except FileNotFoundError:
        raise ValueError(f"File not found: {path}")

async def search(query: str, workspace_id: Optional[str] = None, path_glob: Optional[str] = None, limit: int = 50, regex: bool = False, case_sensitive: bool = False) -> List[Dict[str, Any]]:
    # If workspace_id provided, verify scope.
    # If NOT provided, search ALL active scopes?
    state = ServerState.get()
    
    target_workspaces = []
    if workspace_id:
        if not state.is_scope_allowed(workspace_id):
             raise PermissionError(f"Access to workspace '{workspace_id}' denied.")
        target_workspaces.append(workspace_id)
    else:
        # Search all active scopes
        target_workspaces = list(state.active_scopes)
        
    all_hits = []
    
    for wid in target_workspaces:
        if len(all_hits) >= limit: 
            break
            
        ws = Discovery.get_workspace(wid)
        
        cmd = ["rg", "--json", "--line-number", "--heading"]
        if not case_sensitive: cmd.append("-i")
        if not regex: cmd.append("-F")
        if path_glob: cmd.extend(["-g", path_glob])
        
        cmd.append(query)
        cmd.append(ws.root_path)
        
        try:
            proc = subprocess.run(cmd, capture_output=True, text=True)
            
            seen_ids = set()
            for line in proc.stdout.splitlines():
                if len(all_hits) >= limit: break
                try:
                    data = json.loads(line)
                    if data["type"] == "match":
                        file_abs_path = data["data"]["path"]["text"]
                        line_num = data["data"]["line_number"]
                        snippet = data["data"]["lines"]["text"].strip()
                        
                        if not Security.is_path_safe(file_abs_path):
                            continue
                            
                        rel_path = os.path.relpath(file_abs_path, ws.root_path)
                        query_hash = hashlib.sha1(query.encode()).hexdigest()[:8]
                        hit_id = f"{wid}:{rel_path}:{line_num}:{line_num}:{query_hash}"
                        
                        if hit_id in seen_ids: continue
                        seen_ids.add(hit_id)
                        
                        all_hits.append({
                            "id": hit_id,
                            "workspace_id": wid,
                            "path": rel_path,
                            "line_start": line_num,
                            "line_end": line_num,
                            "snippet": snippet
                        })
                except:
                    continue
        except FileNotFoundError:
             return [{"error": "ripgrep not found"}]

    AuditLogger.log("repo.search", {"workspace_ids": target_workspaces, "query": query})
    return all_hits

async def fetch(id: str) -> Dict[str, Any]:
    try:
        parts = id.split(":")
        ws_id = parts[0]
        # Rest of parsing logic...
        path = ":".join(parts[1:-3])
        line_start = int(parts[-3])
        line_end = int(parts[-2])
    except:
        raise ValueError("Invalid ID")
        
    # Check scope for the ID's workspace
    state = ServerState.get()
    if not state.is_scope_allowed(ws_id):
        raise PermissionError(f"Access to workspace '{ws_id}' denied by active scope.")
        
    ws = Discovery.get_workspace(ws_id)
    abs_path = Security.validate_path(path, ws_id)
    
    try:
        with open(abs_path, 'r', encoding='utf-8') as f:
            all_lines = f.readlines()
        
        start_idx = max(0, line_start - 1 - 2)
        end_idx = min(len(all_lines), line_end + 2)
        relevant = "".join(all_lines[start_idx:end_idx])
        
        AuditLogger.log("repo.fetch", {"id": id})
        return {
            "workspace_id": ws_id,
            "path": path,
            "line_start": start_idx + 1,
            "line_end": end_idx,
            "content": relevant
        }
    except Exception as e:
         raise ValueError(f"Fetch failed: {e}")
