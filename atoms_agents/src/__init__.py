"""Expose the root src tree via atoms_agents.src."""
import os
from pathlib import Path

__all__ = []

_SRC_PATH = Path(__file__).resolve().parents[2] / "src"
if str(_SRC_PATH) not in __path__:
    __path__.append(str(_SRC_PATH))
