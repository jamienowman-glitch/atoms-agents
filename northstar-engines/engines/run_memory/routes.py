"""Deprecated run_memory endpoints."""
from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/run_memory", tags=["run_memory"])


def _deprecated() -> None:
    raise HTTPException(
        status_code=410,
        detail="run_memory endpoints are deprecated; please use /whiteboard/* instead.",
    )


@router.post("/write")
def write_value() -> None:
    _deprecated()


@router.get("/read")
def read_value() -> None:
    _deprecated()


@router.get("/keys")
def list_keys() -> None:
    _deprecated()
