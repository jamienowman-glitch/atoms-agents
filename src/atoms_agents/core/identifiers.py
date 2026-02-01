import hashlib

def generate_deterministic_edge_id(source_node: str, source_handle: str, target_node: str, target_handle: str) -> str:
    """
    Generates a deterministic edge ID based on the source and target node IDs and handles.
    Format: edge_hash(source:handle -> target:handle)
    """
    raw_string = f"{source_node}:{source_handle}->{target_node}:{target_handle}"
    hash_object = hashlib.sha256(raw_string.encode())
    # Take first 12 chars of hex digest for a reasonable length ID that is likely unique enough for a single flow
    suffix = hash_object.hexdigest()[:12]
    return f"edge_{suffix}"
