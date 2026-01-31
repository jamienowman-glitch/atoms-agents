from __future__ import annotations
import os
import asyncio
import shlex
from typing import Dict, Any, Optional, List
from pathlib import Path
from pydantic import BaseModel, Field

from engines.common.identity import RequestContext
from engines.workbench.local_secrets import LocalSecretStore

# --- Input Models ---

class ReadFileInput(BaseModel):
    path: str = Field(..., description="Absolute path or path relative to Dev Root")

class WriteFileInput(BaseModel):
    path: str
    content: str

class ListFilesInput(BaseModel):
    path: str
    recursive: bool = False
    max_depth: int = 1

class RunShellInput(BaseModel):
    command: str
    cwd: Optional[str] = None
    timeout_seconds: int = 30

# --- Helper Logic ---

def _get_root_path(ctx: RequestContext) -> Path:
    secrets = LocalSecretStore()
    # Allow per-tenant root, or global root
    root_str = secrets.get_secret(f"local-dev-root-{ctx.tenant_id}") or secrets.get_secret("local-dev-root")
    if not root_str:
        # Default fallback for this specific user environment
        root_str = "/Users/jaynowman/dev"
    return Path(root_str).resolve()

def _resolve_safe_path(ctx: RequestContext, input_path: str) -> Path:
    root = _get_root_path(ctx)
    
    # Handle absolute paths that start with the root
    target = Path(input_path)
    if not target.is_absolute():
        target = (root / input_path)
    
    target = target.resolve()
    
    # Security Check: Ensure target is within root
    # Note: Using str check for simple containment or commonpath
    try:
        Target_str = str(target)
        Root_str = str(root)
        if not Target_str.startswith(Root_str):
             raise ValueError(f"Access Denied: Path '{input_path}' is outside allowed root '{Root_str}'")
    except Exception as e:
         raise ValueError(f"Invalid Path: {e}")
         
    return target

# --- Handlers ---

async def read_file(ctx: RequestContext, input_data: ReadFileInput) -> Dict[str, Any]:
    target_path = _resolve_safe_path(ctx, input_data.path)
    
    if not target_path.exists():
        return {"error": "File not found", "path": str(target_path)}
        
    if not target_path.is_file():
         return {"error": "Path is not a file", "path": str(target_path)}
    
    # Run blocking I/O in thread
    def _read():
        with open(target_path, "r", encoding="utf-8") as f:
            return f.read()
            
    try:
        content = await asyncio.to_thread(_read)
        return {"content": content, "path": str(target_path)}
    except Exception as e:
        return {"error": str(e)}

async def write_file(ctx: RequestContext, input_data: WriteFileInput) -> Dict[str, Any]:
    target_path = _resolve_safe_path(ctx, input_data.path)
    
    def _write():
        # Ensure parent exists
        target_path.parent.mkdir(parents=True, exist_ok=True)
        with open(target_path, "w", encoding="utf-8") as f:
            f.write(input_data.content)
            
    try:
        await asyncio.to_thread(_write)
        return {"status": "written", "path": str(target_path)}
    except Exception as e:
        return {"error": str(e)}

async def list_files(ctx: RequestContext, input_data: ListFilesInput) -> Dict[str, Any]:
    target_path = _resolve_safe_path(ctx, input_data.path)
    
    if not target_path.exists() or not target_path.is_dir():
         return {"error": "Directory not found", "path": str(target_path)}
         
    def _list():
        results = []
        # Simple non-recursive list for now, or limited recursive
        if input_data.recursive:
             # Basic walk with depth limit logic is complex, straightforward walk
             for root, dirs, files in os.walk(target_path):
                  rel_root = Path(root).relative_to(target_path)
                  depth = len(rel_root.parts)
                  if depth >= input_data.max_depth:
                       del dirs[:] # Stop recursing
                       
                  for name in dirs + files:
                       results.append(str(rel_root / name))
        else:
             for item in target_path.iterdir():
                  results.append(item.name)
        return results

    try:
        files = await asyncio.to_thread(_list)
        return {"files": files, "base": str(target_path)}
    except Exception as e:
        return {"error": str(e)}

async def run_shell(ctx: RequestContext, input_data: RunShellInput) -> Dict[str, Any]:
    cwd_path = _resolve_safe_path(ctx, input_data.cwd) if input_data.cwd else _get_root_path(ctx)
    if not cwd_path.is_dir():
        return {"error": "Invalid CWD", "cwd": str(cwd_path)}

    # Security: In a real env, we'd sanitize command. Assuming Agent is trusted within scope.
    command = input_data.command
    
    try:
        process = await asyncio.create_subprocess_shell(
            command,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
            cwd=str(cwd_path)
        )
        
        try:
            stdout, stderr = await asyncio.wait_for(process.communicate(), timeout=input_data.timeout_seconds)
        except asyncio.TimeoutError:
            process.kill()
            return {"error": "Command timed out", "timeout": input_data.timeout_seconds}
            
        return {
            "stdout": stdout.decode("utf-8", errors="replace"),
            "stderr": stderr.decode("utf-8", errors="replace"),
            "returncode": process.returncode
        }
    except Exception as e:
        return {"error": str(e)}
