from __future__ import annotations

from typing import Optional
from pydantic import BaseModel, Field


class UsageMetric(BaseModel):
    label: str
    value: float
    unit: Optional[str] = None


class ProviderSummary(BaseModel):
    id: str
    label: str
    configured: bool = False
    currency: str = "USD"

    mtd_cost_gbp: float = 0.0
    mtd_cost_no_free_gbp: float = 0.0

    mtd_usage: list[UsageMetric] = Field(default_factory=list)
    free_tier_remaining: list[UsageMetric] = Field(default_factory=list)
    avg_per_flow_gbp: Optional[float] = None

    ltd_revenue_gbp: Optional[float] = None
    ltd_gross_profit_gbp: Optional[float] = None
    ltd_gross_margin_pct: Optional[float] = None

    ltd_revenue_no_free_gbp: Optional[float] = None
    ltd_gross_profit_no_free_gbp: Optional[float] = None
    ltd_gross_margin_no_free_pct: Optional[float] = None

    breakdown_available: bool = False
    notes: list[str] = Field(default_factory=list)


class BudgetSummary(BaseModel):
    as_of: str
    currency: str = "GBP"
    fx_rate: float
    fx_source: str
    providers: list[ProviderSummary]


class ProviderBreakdownItem(BaseModel):
    service: str
    cost_gbp: float
    usage: Optional[float] = None
    unit: Optional[str] = None


class ProviderBreakdown(BaseModel):
    provider: str
    currency: str = "GBP"
    fx_rate: float
    fx_source: str
    items: list[ProviderBreakdownItem]


class ModelUsage(BaseModel):
    model_id: str
    provider_id: str
    official_id: str | None = None
    input_tokens: float = 0.0
    output_tokens: float = 0.0
    requests: float = 0.0
    cost_gbp: float = 0.0
    cost_no_free_gbp: float = 0.0


class ModelProviderSummary(BaseModel):
    id: str
    label: str
    configured: bool = False
    currency: str = "USD"
    mtd_cost_gbp: float = 0.0
    mtd_cost_no_free_gbp: float = 0.0
    mtd_usage: list[UsageMetric] = Field(default_factory=list)
    free_tier_remaining: list[UsageMetric] = Field(default_factory=list)
    avg_per_flow_gbp: Optional[float] = None
    ltd_revenue_gbp: Optional[float] = None
    ltd_gross_profit_gbp: Optional[float] = None
    ltd_gross_margin_pct: Optional[float] = None
    ltd_revenue_no_free_gbp: Optional[float] = None
    ltd_gross_profit_no_free_gbp: Optional[float] = None
    ltd_gross_margin_no_free_pct: Optional[float] = None
    breakdown_available: bool = False
    notes: list[str] = Field(default_factory=list)
    models: list[ModelUsage] = Field(default_factory=list)


class ModelBudgetSummary(BaseModel):
    as_of: str
    currency: str = "GBP"
    fx_rate: float
    fx_source: str
    providers: list[ModelProviderSummary]


class ModelProviderBreakdown(BaseModel):
    provider: str
    currency: str = "GBP"
    fx_rate: float
    fx_source: str
    models: list[ModelUsage]
