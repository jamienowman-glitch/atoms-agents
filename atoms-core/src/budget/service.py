from __future__ import annotations

import json
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any, Optional

import httpx
import boto3

from src.budget.models import (
    BudgetSummary,
    ModelBudgetSummary,
    ModelProviderBreakdown,
    ModelProviderSummary,
    ModelUsage,
    ProviderBreakdown,
    ProviderBreakdownItem,
    ProviderSummary,
    UsageMetric,
)


VAULT_DIR = Path("/Users/jaynowman/northstar-keys")

VAULT_KEYS = {
    # GCP
    "gcp_sa_json": "gcp-billing-sa.json",
    "gcp_project_id": "gcp-billing-project.txt",
    "gcp_bq_dataset": "gcp-billing-dataset.txt",
    "gcp_bq_table": "gcp-billing-table.txt",

    # AWS
    "aws_access_key_id": "aws-access-key-id.txt",
    "aws_secret_access_key": "aws-secret-access-key.txt",
    "aws_region": "aws-region.txt",
    "aws_profile": "aws-profile.txt",

    # Azure
    "azure_tenant_id": "azure-tenant-id.txt",
    "azure_client_id": "azure-client-id.txt",
    "azure_client_secret": "azure-client-secret.txt",
    "azure_subscription_id": "azure-subscription-id.txt",

    # SaaS
    "supabase_service_key": "supabase-service-key.txt",
    "resend_api_key": "resend-key.txt",
    "cloudflare_api_token": "cloudflare-api-token.txt",

    # Finance
    "fx_usd_gbp": "fx-usd-gbp.txt",
    "ltd_revenue_gbp": "ltd-revenue-gbp.txt",
    "ltd_discounts_gbp": "ltd-discounts-gbp.txt",

    # Model Usage + Pricing
    "model_usage_mtd": "model-usage-mtd.json",
    "model_pricing": "model-pricing.json",
    "model_free_credits": "model-free-credits.json",
}

MODEL_REGISTRY_ROOT = Path("/Users/jaynowman/dev/northstar-agents/src/northstar/registry/cards")


class BudgetService:
    def __init__(self, vault_dir: Path | None = None):
        self.vault_dir = vault_dir or VAULT_DIR

    def _read_text(self, filename: str) -> Optional[str]:
        path = self.vault_dir / filename
        if not path.exists():
            return None
        return path.read_text().strip()

    def _read_json(self, filename: str) -> Optional[dict[str, Any]]:
        text = self._read_text(filename)
        if not text:
            return None
        return json.loads(text)

    def _month_bounds(self) -> tuple[datetime, datetime]:
        now = datetime.now(timezone.utc)
        start = datetime(now.year, now.month, 1, tzinfo=timezone.utc)
        end = now + timedelta(days=1)
        return start, end

    def _fx_rate(self) -> tuple[float, str]:
        stored = self._read_text(VAULT_KEYS["fx_usd_gbp"])
        if stored:
            try:
                return float(stored), "vault"
            except ValueError:
                pass
        return 0.79, "static"

    def _to_gbp(self, amount: float, currency: str, fx_rate: float) -> float:
        if currency.upper() in {"GBP", "GBX"}:
            return amount
        if currency.upper() in {"USD", "US$", "USD$"}:
            return amount * fx_rate
        return amount * fx_rate

    def _ltd_revenue(self) -> tuple[Optional[float], Optional[float]]:
        revenue = self._read_text(VAULT_KEYS["ltd_revenue_gbp"])
        discounts = self._read_text(VAULT_KEYS["ltd_discounts_gbp"])
        try:
            revenue_val = float(revenue) if revenue else None
        except ValueError:
            revenue_val = None
        try:
            discounts_val = float(discounts) if discounts else 0.0
        except ValueError:
            discounts_val = 0.0
        return revenue_val, discounts_val

    # -------- AWS --------
    def _aws_costs(self) -> tuple[bool, str, list[dict[str, Any]]]:
        access_key = self._read_text(VAULT_KEYS["aws_access_key_id"])
        secret_key = self._read_text(VAULT_KEYS["aws_secret_access_key"])
        region = self._read_text(VAULT_KEYS["aws_region"]) or "us-east-1"
        profile = self._read_text(VAULT_KEYS["aws_profile"])

        session = boto3.Session(
            aws_access_key_id=access_key,
            aws_secret_access_key=secret_key,
            region_name=region,
            profile_name=profile,
        )
        creds = session.get_credentials()
        if not creds:
            return False, "USD", []

        try:
            client = session.client("ce", region_name="us-east-1")
            start, end = self._month_bounds()
            resp = client.get_cost_and_usage(
                TimePeriod={
                    "Start": start.date().isoformat(),
                    "End": end.date().isoformat(),
                },
                Granularity="MONTHLY",
                Metrics=["UnblendedCost", "UsageQuantity"],
                GroupBy=[{"Type": "DIMENSION", "Key": "SERVICE"}],
            )
        except Exception:
            return False, "USD", []

        groups = resp.get("ResultsByTime", [{}])[0].get("Groups", [])
        breakdown = []
        for g in groups:
            service = g.get("Keys", ["Unknown"])[0]
            cost = float(g["Metrics"]["UnblendedCost"]["Amount"])
            currency = g["Metrics"]["UnblendedCost"]["Unit"] or "USD"
            usage = float(g["Metrics"]["UsageQuantity"]["Amount"])
            unit = g["Metrics"]["UsageQuantity"]["Unit"]
            breakdown.append(
                {
                    "service": service,
                    "cost": cost,
                    "currency": currency,
                    "usage": usage,
                    "unit": unit,
                }
            )
        return True, "USD", breakdown

    # -------- Azure --------
    def _azure_token(self) -> Optional[str]:
        tenant_id = self._read_text(VAULT_KEYS["azure_tenant_id"])
        client_id = self._read_text(VAULT_KEYS["azure_client_id"])
        client_secret = self._read_text(VAULT_KEYS["azure_client_secret"])
        if not tenant_id or not client_id or not client_secret:
            return None

        token_url = f"https://login.microsoftonline.com/{tenant_id}/oauth2/v2.0/token"
        data = {
            "grant_type": "client_credentials",
            "client_id": client_id,
            "client_secret": client_secret,
            "scope": "https://management.azure.com/.default",
        }
        with httpx.Client(timeout=20) as client:
            res = client.post(token_url, data=data)
            if res.status_code != 200:
                return None
            return res.json().get("access_token")

    def _azure_costs(self) -> tuple[bool, str, list[dict[str, Any]]]:
        subscription_id = self._read_text(VAULT_KEYS["azure_subscription_id"])
        token = self._azure_token()
        if not subscription_id or not token:
            return False, "USD", []

        url = (
            f"https://management.azure.com/subscriptions/{subscription_id}"
            "/providers/Microsoft.CostManagement/query?api-version=2023-03-01"
        )
        payload = {
            "type": "ActualCost",
            "timeframe": "MonthToDate",
            "dataset": {
                "granularity": "None",
                "aggregation": {
                    "totalCost": {"name": "Cost", "function": "Sum"},
                    "usage": {"name": "UsageQuantity", "function": "Sum"},
                },
                "grouping": [{"type": "Dimension", "name": "ServiceName"}],
            },
        }
        try:
            with httpx.Client(timeout=30) as client:
                res = client.post(url, headers={"Authorization": f"Bearer {token}"}, json=payload)
                if res.status_code != 200:
                    return False, "USD", []
                data = res.json().get("properties", {})
        except Exception:
            return False, "USD", []

        columns = data.get("columns", [])
        rows = data.get("rows", [])
        col_index = {c["name"]: i for i, c in enumerate(columns)}
        breakdown = []
        for row in rows:
            service = row[col_index.get("ServiceName", 0)]
            cost = float(row[col_index.get("Cost", 0)])
            usage = None
            unit = None
            if "UsageQuantity" in col_index:
                usage = float(row[col_index["UsageQuantity"]])
            if "UsageUnit" in col_index:
                unit = row[col_index["UsageUnit"]]
            breakdown.append(
                {
                    "service": service,
                    "cost": cost,
                    "currency": "USD",
                    "usage": usage,
                    "unit": unit,
                }
            )
        return True, "USD", breakdown

    # -------- GCP --------
    def _gcp_sa_path(self) -> Optional[Path]:
        primary = self.vault_dir / VAULT_KEYS["gcp_sa_json"]
        if primary.exists():
            return primary
        fallback = self.vault_dir / "northstar-os-dev-877e05648e82.json"
        if fallback.exists():
            return fallback
        return None

    def _gcp_costs(self) -> tuple[bool, str, list[dict[str, Any]]]:
        project_id = self._read_text(VAULT_KEYS["gcp_project_id"])
        dataset = self._read_text(VAULT_KEYS["gcp_bq_dataset"])
        table = self._read_text(VAULT_KEYS["gcp_bq_table"])
        sa_path = self._gcp_sa_path()
        if not project_id or not dataset or not table or not sa_path:
            return False, "USD", []

        try:
            from google.cloud import bigquery
            from google.oauth2 import service_account
        except Exception:
            return False, "USD", []

        creds = service_account.Credentials.from_service_account_file(str(sa_path))
        client = bigquery.Client(project=project_id, credentials=creds)

        start, end = self._month_bounds()
        query = f"""
            SELECT
              service.description AS service,
              SUM(cost) AS cost,
              SUM(usage.amount) AS usage_amount,
              ANY_VALUE(usage.unit) AS usage_unit,
              ANY_VALUE(currency) AS currency
            FROM `{project_id}.{dataset}.{table}`
            WHERE usage_start_time >= TIMESTAMP("{start.isoformat()}")
              AND usage_start_time < TIMESTAMP("{end.isoformat()}")
            GROUP BY service
            ORDER BY cost DESC
        """
        try:
            rows = client.query(query).result()
        except Exception:
            return False, "USD", []

        breakdown = []
        currency = "USD"
        for row in rows:
            currency = row.get("currency") or currency
            breakdown.append(
                {
                    "service": row.get("service") or "Unknown",
                    "cost": float(row.get("cost") or 0),
                    "currency": currency,
                    "usage": float(row.get("usage_amount") or 0),
                    "unit": row.get("usage_unit"),
                }
            )
        return True, currency, breakdown

    # -------- SaaS (Stub) --------
    def _saas_status(self, key: str) -> bool:
        return self._read_text(key) is not None

    def _extract_value(self, doc: str, key: str) -> Optional[str]:
        for line in doc.splitlines():
            stripped = line.strip()
            if not stripped or stripped.startswith("#"):
                continue
            if stripped.startswith(f"{key}:"):
                return stripped.split(":", 1)[1].strip().strip('"').strip("'")
        return None

    def _parse_yaml_docs(self, text: str) -> list[str]:
        docs = [d for d in text.split("---") if d.strip()]
        return docs

    def _load_model_registry(self) -> tuple[dict[str, str], list[dict[str, str]]]:
        providers: dict[str, str] = {}
        models: list[dict[str, str]] = []
        if not MODEL_REGISTRY_ROOT.exists():
            return providers, models

        provider_dir = MODEL_REGISTRY_ROOT / "providers"
        model_dir = MODEL_REGISTRY_ROOT / "models"
        for path in provider_dir.glob("*.yaml"):
            text = path.read_text()
            for doc in self._parse_yaml_docs(text):
                if self._extract_value(doc, "card_type") != "provider":
                    continue
                provider_id = self._extract_value(doc, "provider_id")
                if not provider_id:
                    continue
                name = self._extract_value(doc, "name") or provider_id
                providers[provider_id] = name

        for path in model_dir.glob("*.yaml"):
            text = path.read_text()
            for doc in self._parse_yaml_docs(text):
                if self._extract_value(doc, "card_type") != "model":
                    continue
                model_id = self._extract_value(doc, "model_id")
                provider_id = self._extract_value(doc, "provider_id")
                if not model_id or not provider_id:
                    continue
                official_id = self._extract_value(doc, "official_id")
                models.append(
                    {
                        "model_id": model_id,
                        "provider_id": provider_id,
                        "official_id": official_id or "",
                    }
                )
        return providers, models

    def _load_model_usage(self) -> dict[str, Any]:
        return self._read_json(VAULT_KEYS["model_usage_mtd"]) or {}

    def _load_model_pricing(self) -> dict[str, Any]:
        return self._read_json(VAULT_KEYS["model_pricing"]) or {}

    def _load_model_free_credits(self) -> dict[str, Any]:
        return self._read_json(VAULT_KEYS["model_free_credits"]) or {}

    def _calc_model_cost(
        self,
        pricing: dict[str, Any],
        usage: dict[str, Any],
        fx_rate: float,
    ) -> tuple[float, float]:
        input_tokens = float(usage.get("input_tokens", 0) or 0)
        output_tokens = float(usage.get("output_tokens", 0) or 0)
        input_per_million = float(pricing.get("input_per_million", 0) or 0)
        output_per_million = float(pricing.get("output_per_million", 0) or 0)
        currency = (pricing.get("currency") or "USD").upper()
        cost = (input_tokens / 1_000_000) * input_per_million + (output_tokens / 1_000_000) * output_per_million
        cost_gbp = self._to_gbp(cost, currency, fx_rate)
        return cost_gbp, cost_gbp

    # -------- Public API --------
    def get_mtd_summary(self) -> BudgetSummary:
        fx_rate, fx_source = self._fx_rate()
        revenue_ltd, discounts_ltd = self._ltd_revenue()

        providers: list[ProviderSummary] = []

        # GCP
        gcp_ok, gcp_currency, gcp_breakdown = self._gcp_costs()
        gcp_total = sum(item["cost"] for item in gcp_breakdown) if gcp_breakdown else 0.0
        gcp_cost_gbp = self._to_gbp(gcp_total, gcp_currency, fx_rate)
        gcp_usage = [
            UsageMetric(label=item["service"], value=item["usage"], unit=item["unit"])
            for item in gcp_breakdown[:3]
            if item.get("usage") is not None
        ]
        providers.append(
            ProviderSummary(
                id="gcp",
                label="GCP",
                configured=gcp_ok,
                currency=gcp_currency,
                mtd_cost_gbp=gcp_cost_gbp,
                mtd_cost_no_free_gbp=gcp_cost_gbp,
                mtd_usage=gcp_usage,
                avg_per_flow_gbp=None,
                ltd_revenue_gbp=revenue_ltd,
                ltd_gross_profit_gbp=(revenue_ltd - gcp_cost_gbp - (discounts_ltd or 0.0)) if revenue_ltd is not None else None,
                ltd_gross_margin_pct=(
                    ((revenue_ltd - gcp_cost_gbp - (discounts_ltd or 0.0)) / revenue_ltd) * 100
                    if revenue_ltd
                    else None
                ),
                ltd_revenue_no_free_gbp=revenue_ltd,
                ltd_gross_profit_no_free_gbp=(revenue_ltd - gcp_cost_gbp - (discounts_ltd or 0.0)) if revenue_ltd is not None else None,
                ltd_gross_margin_no_free_pct=(
                    ((revenue_ltd - gcp_cost_gbp - (discounts_ltd or 0.0)) / revenue_ltd) * 100
                    if revenue_ltd
                    else None
                ),
                breakdown_available=gcp_ok,
                notes=["No-free-tier cost is currently an estimate"] if gcp_ok else ["Missing GCP billing export config"],
            )
        )

        # AWS
        aws_ok, aws_currency, aws_breakdown = self._aws_costs()
        aws_total = sum(item["cost"] for item in aws_breakdown) if aws_breakdown else 0.0
        aws_cost_gbp = self._to_gbp(aws_total, aws_currency, fx_rate)
        aws_usage = [
            UsageMetric(label=item["service"], value=item["usage"], unit=item["unit"])
            for item in aws_breakdown[:3]
            if item.get("usage") is not None
        ]
        providers.append(
            ProviderSummary(
                id="aws",
                label="AWS",
                configured=aws_ok,
                currency=aws_currency,
                mtd_cost_gbp=aws_cost_gbp,
                mtd_cost_no_free_gbp=aws_cost_gbp,
                mtd_usage=aws_usage,
                avg_per_flow_gbp=None,
                ltd_revenue_gbp=revenue_ltd,
                ltd_gross_profit_gbp=(revenue_ltd - aws_cost_gbp - (discounts_ltd or 0.0)) if revenue_ltd is not None else None,
                ltd_gross_margin_pct=(
                    ((revenue_ltd - aws_cost_gbp - (discounts_ltd or 0.0)) / revenue_ltd) * 100
                    if revenue_ltd
                    else None
                ),
                ltd_revenue_no_free_gbp=revenue_ltd,
                ltd_gross_profit_no_free_gbp=(revenue_ltd - aws_cost_gbp - (discounts_ltd or 0.0)) if revenue_ltd is not None else None,
                ltd_gross_margin_no_free_pct=(
                    ((revenue_ltd - aws_cost_gbp - (discounts_ltd or 0.0)) / revenue_ltd) * 100
                    if revenue_ltd
                    else None
                ),
                breakdown_available=aws_ok,
                notes=["No-free-tier cost is currently an estimate"] if aws_ok else ["Missing AWS credentials"],
            )
        )

        # Azure
        az_ok, az_currency, az_breakdown = self._azure_costs()
        az_total = sum(item["cost"] for item in az_breakdown) if az_breakdown else 0.0
        az_cost_gbp = self._to_gbp(az_total, az_currency, fx_rate)
        az_usage = [
            UsageMetric(label=item["service"], value=item["usage"], unit=item["unit"])
            for item in az_breakdown[:3]
            if item.get("usage") is not None
        ]
        providers.append(
            ProviderSummary(
                id="azure",
                label="Azure",
                configured=az_ok,
                currency=az_currency,
                mtd_cost_gbp=az_cost_gbp,
                mtd_cost_no_free_gbp=az_cost_gbp,
                mtd_usage=az_usage,
                avg_per_flow_gbp=None,
                ltd_revenue_gbp=revenue_ltd,
                ltd_gross_profit_gbp=(revenue_ltd - az_cost_gbp - (discounts_ltd or 0.0)) if revenue_ltd is not None else None,
                ltd_gross_margin_pct=(
                    ((revenue_ltd - az_cost_gbp - (discounts_ltd or 0.0)) / revenue_ltd) * 100
                    if revenue_ltd
                    else None
                ),
                ltd_revenue_no_free_gbp=revenue_ltd,
                ltd_gross_profit_no_free_gbp=(revenue_ltd - az_cost_gbp - (discounts_ltd or 0.0)) if revenue_ltd is not None else None,
                ltd_gross_margin_no_free_pct=(
                    ((revenue_ltd - az_cost_gbp - (discounts_ltd or 0.0)) / revenue_ltd) * 100
                    if revenue_ltd
                    else None
                ),
                breakdown_available=az_ok,
                notes=["No-free-tier cost is currently an estimate"] if az_ok else ["Missing Azure credentials"],
            )
        )

        # SaaS Stubs
        saas_keys = {
            "supabase": VAULT_KEYS["supabase_service_key"],
            "resend": VAULT_KEYS["resend_api_key"],
            "cloudflare": VAULT_KEYS["cloudflare_api_token"],
        }
        for provider_id, label in [
            ("supabase", "Supabase"),
            ("resend", "Resend"),
            ("cloudflare", "Cloudflare"),
        ]:
            key = saas_keys[provider_id]
            configured = self._saas_status(key)
            providers.append(
                ProviderSummary(
                    id=provider_id,
                    label=label,
                    configured=configured,
                    currency="USD",
                    mtd_cost_gbp=0.0,
                    mtd_cost_no_free_gbp=0.0,
                    avg_per_flow_gbp=None,
                    ltd_revenue_gbp=revenue_ltd,
                    ltd_gross_profit_gbp=None,
                    ltd_gross_margin_pct=None,
                    ltd_revenue_no_free_gbp=revenue_ltd,
                    ltd_gross_profit_no_free_gbp=None,
                    ltd_gross_margin_no_free_pct=None,
                    breakdown_available=False,
                    notes=["Usage integration pending"],
                )
            )

        summary = BudgetSummary(
            as_of=datetime.now(timezone.utc).date().isoformat(),
            fx_rate=fx_rate,
            fx_source=fx_source,
            providers=providers,
        )
        return summary

    def get_model_summary(self) -> ModelBudgetSummary:
        fx_rate, fx_source = self._fx_rate()
        revenue_ltd, discounts_ltd = self._ltd_revenue()
        providers_map, models_list = self._load_model_registry()
        registry_provider_ids = set(providers_map.keys())

        expected = {"groq", "openrouter", "mistral", "comet", "nvidia", "bedrock", "vertex", "gemini"}
        for provider_id in expected:
            providers_map.setdefault(provider_id, provider_id.upper())

        usage_data = self._load_model_usage()
        pricing_data = self._load_model_pricing()
        free_credit_data = self._load_model_free_credits()

        usage_providers = usage_data.get("providers", {}) if isinstance(usage_data, dict) else {}
        pricing_providers = pricing_data.get("providers", {}) if isinstance(pricing_data, dict) else {}
        free_credit_providers = free_credit_data.get("providers", {}) if isinstance(free_credit_data, dict) else {}

        providers: list[ModelProviderSummary] = []

        for provider_id in sorted(providers_map.keys()):
            provider_label = providers_map[provider_id]
            provider_models = [m for m in models_list if m["provider_id"] == provider_id]
            usage_provider = usage_providers.get(provider_id, {})
            usage_models = usage_provider.get("models", {}) if isinstance(usage_provider, dict) else {}
            pricing_provider = pricing_providers.get(provider_id, {})
            pricing_models = pricing_provider.get("models", {}) if isinstance(pricing_provider, dict) else {}
            free_credit = free_credit_providers.get(provider_id, {}).get("mtd_gbp", 0) if isinstance(free_credit_providers.get(provider_id, {}), dict) else 0

            model_ids = {m["model_id"] for m in provider_models}
            model_ids.update(usage_models.keys())
            model_ids.update(pricing_models.keys())

            models: list[ModelUsage] = []
            total_cost_no_free = 0.0

            for model_id in sorted(model_ids):
                registry_model = next((m for m in provider_models if m["model_id"] == model_id), None)
                usage = usage_models.get(model_id, {}) if isinstance(usage_models, dict) else {}
                pricing = pricing_models.get(model_id, {}) if isinstance(pricing_models, dict) else {}
                cost_gbp, cost_no_free = self._calc_model_cost(pricing, usage, fx_rate)

                total_cost_no_free += cost_no_free
                models.append(
                    ModelUsage(
                        model_id=model_id,
                        provider_id=provider_id,
                        official_id=(registry_model.get("official_id") if registry_model else None),
                        input_tokens=float(usage.get("input_tokens", 0) or 0),
                        output_tokens=float(usage.get("output_tokens", 0) or 0),
                        requests=float(usage.get("requests", 0) or 0),
                        cost_gbp=cost_gbp,
                        cost_no_free_gbp=cost_no_free,
                    )
                )

            cost_with_free = max(0.0, total_cost_no_free - (float(free_credit) if free_credit else 0.0))
            total_input = sum(m.input_tokens for m in models)
            total_output = sum(m.output_tokens for m in models)
            total_requests = sum(m.requests for m in models)

            notes = []
            if provider_id not in registry_provider_ids:
                notes.append("Missing provider card in northstar-agents")
            if not pricing_models:
                notes.append("Pricing priors missing")
            if not usage_models:
                notes.append("Usage logging pending")

            providers.append(
                ModelProviderSummary(
                    id=provider_id,
                    label=provider_label,
                    configured=provider_id in registry_provider_ids,
                    currency="USD",
                    mtd_cost_gbp=cost_with_free,
                    mtd_cost_no_free_gbp=total_cost_no_free,
                    mtd_usage=[
                        UsageMetric(label="input_tokens", value=total_input, unit="tokens"),
                        UsageMetric(label="output_tokens", value=total_output, unit="tokens"),
                        UsageMetric(label="requests", value=total_requests, unit="calls"),
                    ],
                    free_tier_remaining=[
                        UsageMetric(label="free_credits_gbp", value=float(free_credit or 0), unit="GBP"),
                    ],
                    avg_per_flow_gbp=None,
                    ltd_revenue_gbp=revenue_ltd,
                    ltd_gross_profit_gbp=(revenue_ltd - cost_with_free - (discounts_ltd or 0.0)) if revenue_ltd is not None else None,
                    ltd_gross_margin_pct=(
                        ((revenue_ltd - cost_with_free - (discounts_ltd or 0.0)) / revenue_ltd) * 100
                        if revenue_ltd
                        else None
                    ),
                    ltd_revenue_no_free_gbp=revenue_ltd,
                    ltd_gross_profit_no_free_gbp=(revenue_ltd - total_cost_no_free - (discounts_ltd or 0.0)) if revenue_ltd is not None else None,
                    ltd_gross_margin_no_free_pct=(
                        ((revenue_ltd - total_cost_no_free - (discounts_ltd or 0.0)) / revenue_ltd) * 100
                        if revenue_ltd
                        else None
                    ),
                    breakdown_available=len(models) > 0,
                    notes=notes or ["Registry loaded"],
                    models=sorted(models, key=lambda m: m.cost_gbp, reverse=True),
                )
            )

        return ModelBudgetSummary(
            as_of=datetime.now(timezone.utc).date().isoformat(),
            fx_rate=fx_rate,
            fx_source=fx_source,
            providers=providers,
        )

    def get_model_breakdown(self, provider: str) -> ModelProviderBreakdown:
        summary = self.get_model_summary()
        provider_data = next((p for p in summary.providers if p.id == provider), None)
        return ModelProviderBreakdown(
            provider=provider,
            fx_rate=summary.fx_rate,
            fx_source=summary.fx_source,
            models=provider_data.models if provider_data else [],
        )

    def get_breakdown(self, provider: str) -> ProviderBreakdown:
        fx_rate, fx_source = self._fx_rate()

        if provider == "gcp":
            ok, currency, breakdown = self._gcp_costs()
        elif provider == "aws":
            ok, currency, breakdown = self._aws_costs()
        elif provider == "azure":
            ok, currency, breakdown = self._azure_costs()
        else:
            ok, currency, breakdown = False, "USD", []

        items = []
        if ok:
            for item in breakdown:
                items.append(
                    ProviderBreakdownItem(
                        service=item["service"],
                        cost_gbp=self._to_gbp(item["cost"], currency, fx_rate),
                        usage=item.get("usage"),
                        unit=item.get("unit"),
                    )
                )
        return ProviderBreakdown(
            provider=provider,
            fx_rate=fx_rate,
            fx_source=fx_source,
            items=items,
        )
