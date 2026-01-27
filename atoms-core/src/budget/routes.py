from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Request

from src.budget.models import BudgetSummary, ModelBudgetSummary, ModelProviderBreakdown, ProviderBreakdown
from src.budget.service import BudgetService
from src.identity.constants import ROOT_TENANT_ID


router = APIRouter(prefix="/budget", tags=["budget"])


def require_system(request: Request):
    if request.state.tenant_id != ROOT_TENANT_ID:
        raise HTTPException(status_code=403, detail="System access required")
    return request.state


def get_service() -> BudgetService:
    return BudgetService()


@router.get("/mtd", response_model=BudgetSummary)
def get_mtd_budget(
    _identity=Depends(require_system),
    service: BudgetService = Depends(get_service),
):
    return service.get_mtd_summary()


@router.get("/{provider}/breakdown", response_model=ProviderBreakdown)
def get_provider_breakdown(
    provider: str,
    _identity=Depends(require_system),
    service: BudgetService = Depends(get_service),
):
    return service.get_breakdown(provider)


@router.get("/models", response_model=ModelBudgetSummary)
def get_model_budget(
    _identity=Depends(require_system),
    service: BudgetService = Depends(get_service),
):
    return service.get_model_summary()


@router.get("/models/{provider}", response_model=ModelProviderBreakdown)
def get_model_provider_breakdown(
    provider: str,
    _identity=Depends(require_system),
    service: BudgetService = Depends(get_service),
):
    return service.get_model_breakdown(provider)
