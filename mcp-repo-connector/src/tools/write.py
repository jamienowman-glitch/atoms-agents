import os
import subprocess
import tempfile
import hashlib
from typing import Dict, Any, List
from ..config import ConfigLoader
from ..security import Security, SecurityError
from ..discovery import Discovery
from ..audit import AuditLogger
from ..state import ServerState

def _resolve_workspace_id(workspace_id: str) -> str:
    state = ServerState.get()
    if workspace_id:
        if not state.is_scope_allowed(workspace_id):
            raise PermissionError(f"Access to workspace '{workspace_id}' denied by active scope.")
        return workspace_id
    
    # Get active scope if single
    if len(state.active_scopes) == 1:
        return list(state.active_scopes)[0]
    
    raise ValueError("Workspace ID required (multiple scopes active).")

def _check_writes_enabled():
    state = ServerState.get()
    state.check_write_permission()
    # Also valid: state.write_enabled check which raises PermissionError

def _run_git(cwd: str, args: List[str]) -> str:
    try:
        res = subprocess.run(["git"] + args, cwd=cwd, capture_output=True, text=True, check=True)
        return res.stdout.strip()
    except subprocess.CalledProcessError as e:
        raise RuntimeError(f"Git error: {e.stderr}")

async def _enforce_branch_policy(root_path: str):
    if not os.path.exists(os.path.join(root_path, ".git")):
        return

    branch = _run_git(root_path, ["rev-parse", "--abbrev-ref", "HEAD"])
    if branch in ["main", "master"]:
        # Auto-switch to 'patch-auto' if requested?
        # User said "auto create/switch branch".
        # Let's try to switch to a safe branch name.
        safe_branch = "mcp-auto-edit"
        try:
             _run_git(root_path, ["checkout", safe_branch])
        except:
             # Create it
             _run_git(root_path, ["checkout", "-b", safe_branch])
             
        # Verify again
        branch = _run_git(root_path, ["rev-parse", "--abbrev-ref", "HEAD"])
        if branch in ["main", "master"]:
            raise SecurityError("Failed to switch to safe branch.")

async def write_file(workspace_id: str = None, path: str = None, content: str = None, dry_run: bool = True) -> Dict[str, Any]:
    _check_writes_enabled() # Checks session state
    ws_id = _resolve_workspace_id(workspace_id)
    abs_path = Security.validate_path(path, ws_id)
    
    new_sha = hashlib.sha256(content.encode('utf-8')).hexdigest()
    
    if dry_run:
        AuditLogger.log("repo.write_file", {"workspace_id": ws_id, "path": path, "dry_run": True})
        return {"dry_run": True, "applied": False, "new_sha256": new_sha}
        
    ws = Discovery.get_workspace(ws_id)
    await _enforce_branch_policy(ws.root_path)
    
    os.makedirs(os.path.dirname(abs_path), exist_ok=True)
    with open(abs_path, 'w', encoding='utf-8') as f:
        f.write(content)
        
    AuditLogger.log("repo.write_file", {"workspace_id": ws_id, "path": path, "dry_run": False})
    return {"dry_run": False, "applied": True, "new_sha256": new_sha}

async def apply_patch(workspace_id: str = None, path: str = None, unified_diff: str = None, dry_run: bool = True) -> Dict[str, Any]:
    _check_writes_enabled()
    ws_id = _resolve_workspace_id(workspace_id)
    abs_path = Security.validate_path(path, ws_id)
    
    with tempfile.NamedTemporaryFile(mode='w+', delete=False) as tmp:
        tmp.write(unified_diff)
        tmp_name = tmp.name
        
    try:
        cmd = ["patch", "-u", abs_path, tmp_name]
        if dry_run: cmd.append("--dry-run")
        else:
            ws = Discovery.get_workspace(ws_id)
            await _enforce_branch_policy(ws.root_path)

        res = subprocess.run(cmd, capture_output=True, text=True)
        
        new_sha = None
        if not dry_run and res.returncode == 0:
            with open(abs_path, 'rb') as f:
                new_sha = hashlib.sha256(f.read()).hexdigest()
        
        AuditLogger.log("repo.apply_patch", {"workspace_id": ws_id, "path": path, "dry_run": dry_run})
        
        return {
            "dry_run": dry_run,
            "applied": res.returncode == 0,
            "new_sha256": new_sha,
            "stdout": res.stdout,
            "stderr": res.stderr
        }
    finally:
        if os.path.exists(tmp_name): os.remove(tmp_name)

# Helper stubs for git tools if needed (commit/status/branch)
# They should also use _check_writes_enabled and resolve_id logic
async def status(workspace_id: str = None):
    ws_id = _resolve_workspace_id(workspace_id)
    ws = Discovery.get_workspace(ws_id)
    if os.path.exists(os.path.join(ws.root_path, ".git")):
        branch = _run_git(ws.root_path, ["rev-parse", "--abbrev-ref", "HEAD"])
        summary = _run_git(ws.root_path, ["status", "--short"])
        return {"branch": branch, "is_clean": len(summary) == 0, "summary": summary}
    return {"error": "Not a git repo"}

async def create_branch(workspace_id: str = None, name: str = None):
    _check_writes_enabled()
    ws_id = _resolve_workspace_id(workspace_id)
    ws = Discovery.get_workspace(ws_id)
    if name in ["main", "master"]: raise SecurityError("Invalid branch name")
    _run_git(ws.root_path, ["checkout", "-b", name])
    AuditLogger.log("git.create_branch", {"workspace_id": ws_id, "branch": name})
    return {"branch": name}

async def commit(workspace_id: str = None, message: str = None, paths: List[str] = []):
    _check_writes_enabled()
    ws_id = _resolve_workspace_id(workspace_id)
    ws = Discovery.get_workspace(ws_id)
    await _enforce_branch_policy(ws.root_path)
    
    # Add files...
    safe_paths = []
    for p in paths:
        abs_p = Security.validate_path(p, ws_id)
        rel_p = os.path.relpath(abs_p, ws.root_path)
        safe_paths.append(rel_p)
    
    _run_git(ws.root_path, ["add"] + safe_paths)
    _run_git(ws.root_path, ["commit", "-m", message])
    sha = _run_git(ws.root_path, ["rev-parse", "HEAD"])
    
    AuditLogger.log("git.commit", {"workspace_id": ws_id})
    return {"commit_hash": sha}
