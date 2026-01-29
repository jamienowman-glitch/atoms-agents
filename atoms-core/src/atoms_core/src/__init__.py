"""Shim package to expose top-level `src` as `atoms_core.src`."""
import importlib
import sys as _sys

_src = importlib.import_module("src")
_sys.modules[__name__] = _src
