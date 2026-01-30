"""
CAD Semantics Service Wrapper.
Wraps atoms-core implementation.
"""

from atoms_core.src.cad.semantics.service import (
    SemanticClassificationService,
    get_semantic_service,
    set_semantic_service,
)

__all__ = ["SemanticClassificationService", "get_semantic_service", "set_semantic_service"]
