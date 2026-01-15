import os
import fnmatch
from typing import List
from .config import ConfigLoader
from .discovery import Discovery

# Denylist patterns for sensitive files - expanded
DENYLIST_PATTERNS = [
    # Environment & Secrets
    ".env", ".env.*", 
    
    # Keys & Certs
    "*.pem", "*.key", "id_rsa*", "*.p12", "*.pfx",
    "*.cer", "*.crt", "*.der",
    
    # Cloud Credentials
    "*credential*", "*credentials*", 
    "*token*", 
    "*secret*", "*secrets*",
    
    # Directories
    ".aws/", ".ssh/", ".gnupg/",
    "gcloud/", # often inside config dirs
]

class SecurityError(Exception):
    pass

class Security:
    @staticmethod
    def is_path_safe(path: str) -> bool:
        """
        Validates a path against safety rules:
        1. Must be inside global root_path.
        2. Must not match denylist patterns.
        """
        config = ConfigLoader.get()
        root_path = os.path.abspath(config.root_path)
        abs_path = os.path.abspath(path)

        # 1. Sandboxing: Must be within global root
        if not abs_path.startswith(root_path):
            return False

        # 2. Denylist check
        filename = os.path.basename(abs_path)
        
        # Check filename patterns
        for pattern in DENYLIST_PATTERNS:
            if "/" not in pattern:
                # Filename match
                if fnmatch.fnmatch(filename, pattern):
                    return False
            
        # Check path components and directory patterns
        # Split path relative to root to check subdirectories
        rel_path = os.path.relpath(abs_path, root_path)
        path_parts = rel_path.split(os.sep)
        
        for part in path_parts:
            # Check each path component against simple wildcard patterns
            for pattern in DENYLIST_PATTERNS:
                if "/" not in pattern:
                    if fnmatch.fnmatch(part, pattern):
                        return False
        
        # Check directory patterns (e.g. .aws/)
        # Naive traversal check
        for pattern in DENYLIST_PATTERNS:
            if pattern.endswith("/"):
                # It's a directory pattern
                dirname = pattern.rstrip("/")
                if dirname in path_parts:
                    return False
                    
        # Content-based path matching for "gcloud/adc" etc.
        # Hardcoded specific dangerous paths
        if ".aws" in path_parts or ".ssh" in path_parts:
            return False
        
        return True

    @classmethod
    def validate_path(cls, path: str, workspace_id: str) -> str:
        """
        Resolves a path relative to a workspace and validates it.
        Returns absolute path.
        """
        ws = Discovery.get_workspace(workspace_id)
        
        if not os.path.isabs(path):
            abs_path = os.path.join(ws.root_path, path)
        else:
            abs_path = path

        # Ensure canonical path to avoid .. tricks
        abs_path = os.path.realpath(abs_path)
        
        if not cls.is_path_safe(abs_path):
             raise SecurityError(f"Access denied to path: {path}")
             
        return abs_path
