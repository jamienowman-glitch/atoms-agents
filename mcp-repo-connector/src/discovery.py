import os
from typing import List, Dict
from .config import ConfigLoader, Workspace

class Discovery:
    @staticmethod
    def scan() -> List[Workspace]:
        config = ConfigLoader.get()
        root = config.root_path
        
        workspaces = []
        
        # 1. Add Device Root
        workspaces.append(Workspace(
            id="dev-root",
            root_path=root,
            kind="root",
            display_name="Device Root (/dev)"
        ))
        
        # 2. Scan for git repos
        # We'll limit depth to prevent infinite recursion, but user said "Expose ALL folders"
        # However, typically git repos are top-level or one level deep in 'dev'.
        # Let's walk.
        
        discovered_ids = {"dev-root"}
        
        for dirpath, dirnames, filenames in os.walk(root):
            # Check if this folder is a git repo
            if ".git" in dirnames:
                # It's a repo
                repo_name = os.path.basename(dirpath)
                
                # Generate unique ID
                ws_id = repo_name
                counter = 1
                while ws_id in discovered_ids:
                    ws_id = f"{repo_name}-{counter}"
                    counter += 1
                
                workspaces.append(Workspace(
                    id=ws_id,
                    root_path=dirpath,
                    kind="repo",
                    display_name=repo_name
                ))
                discovered_ids.add(ws_id)
                
                # Don't recurse into .git
                if ".git" in dirnames:
                    dirnames.remove(".git")
                    
            # Optimization: Skip node_modules, venv, or hidden dirs from traversal?
            # User said "Expose ALL folders".
            # But we definitely shouldn't traverse into .git/ objects
            # And probably should skip standard ignore folders to speed up discovery
            # But strict requirement "Expose ALL folders" might mean even deeply nested ones?
            # "Identify git repos" -> usually we stop at the repo root. 
            # If I have a repo inside a repo (rare, submodules), it handles it.
            
            # Prune hidden dirs for efficiency
            dirnames[:] = [d for d in dirnames if not d.startswith(".")]

        # Update cache in config
        config._discovered_workspaces = {ws.id: ws for ws in workspaces}
        
        return workspaces

    @staticmethod
    def get_workspace(workspace_id: str) -> Workspace:
        config = ConfigLoader.get()
        if not config._discovered_workspaces:
            Discovery.scan()
            
        if workspace_id not in config._discovered_workspaces:
            # Try re-scan?
            Discovery.scan()
            
        if workspace_id not in config._discovered_workspaces:
             raise ValueError(f"Workspace not found: {workspace_id}")
             
        return config._discovered_workspaces[workspace_id]
