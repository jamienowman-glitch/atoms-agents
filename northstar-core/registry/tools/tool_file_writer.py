import os
import yaml

def write_registry_file(file_path: str, content: str):
    """
    Writes content to a file in the registry.
    Args:
        file_path (str): Relative path like 'registry/agents/agent_foo.yaml'
        content (str): The content to write
    """
    # Security: Ensure path is within registry
    if ".." in file_path or not file_path.startswith("registry/"):
        return f"Error: Invalid path {file_path}. Must start with 'registry/'"
        
    full_path = os.path.abspath(os.path.join(os.getcwd(), file_path))
    
    # Ensure dir exists
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    
    try:
        with open(full_path, "w") as f:
            f.write(content)
        return f"Success: Written to {file_path}"
    except Exception as e:
        return f"Error writing file: {e}"
