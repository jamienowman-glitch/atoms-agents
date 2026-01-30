"""
CAD Ingest Service Wrapper.
Wraps atoms-core implementation.
"""

from atoms_core.src.cad.ingest.service import (
    CadIngestService,
    get_cad_ingest_service,
    set_cad_ingest_service,
)

__all__ = ["CadIngestService", "get_cad_ingest_service", "set_cad_ingest_service"]
