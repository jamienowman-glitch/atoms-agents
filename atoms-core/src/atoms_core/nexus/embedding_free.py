
"""Embedding Client (Lightweight). 
Delegates heavy lifting to atoms-muscle via HTTP/MCP.
"""
from typing import List

class FreeEmbeddingAdapter:
    """
    Lightweight adapter that SHOULD call the Muscle Service.
    For now, we just trap the heavy imports and return stubs if Muscle is offline,
    or we should refactor to HTTP calls.
    
    TODO: Wire this to call the new atoms-muscle/nexus/embeddings/mcp.py endpoint.
    """
    
    def embed_text(self, text: str) -> List[float]:
        # TODO: Call Muscle API
        return [0.0] * 1024

    def embed_image(self, image_path: str) -> List[float]:
        # TODO: Call Muscle API
        return [0.0] * 512

    def generate_map_coords(self, vectors: List[List[float]]) -> List[List[float]]:
        # TODO: Call Muscle API
        if not vectors: return []
        return [[0.0, 0.0, 0.0] for _ in vectors]
