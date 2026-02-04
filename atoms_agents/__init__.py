"""Namespace package layering for atoms_agents modules."""
from pathlib import Path

__all__ = []

_SRC_PACKAGE = Path(__file__).resolve().parents[1] / "src" / "atoms_agents"
if _SRC_PACKAGE.exists() and str(_SRC_PACKAGE) not in __path__:
    __path__.append(str(_SRC_PACKAGE))
